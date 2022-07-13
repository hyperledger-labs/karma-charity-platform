import { Logger } from '@ts-core/common/logger';
import { Injectable } from '@nestjs/common';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { PaymentPayCommand, IPaymentPayDto } from '../PaymentPayCommand';
import { PaymentEntity } from '@project/module/database/payment';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { CoinEmitType, CoinObjectType } from '@project/common/transport/command/coin';
import { ExtendedError, UnreachableStatementError } from '@ts-core/common/error';
import { DatabaseService } from '@project/module/database/service';
import { PaymentTransactionEntity } from '@project/module/database/payment';
import { IPaymentTarget, PaymentAccountId, PaymentTarget, PaymentTransactionType, PaymentUtil } from '@project/common/platform/payment';
import { MathUtil, ObjectUtil } from '@ts-core/common/util';
import { AccountType } from '@project/common/platform/account';
import { AccountEntity } from '@project/module/database/account';
import { UserGuard } from '@project/module/guard';
import { CompanyEntity } from '@project/module/database/company';
import { ProjectEntity } from '@project/module/database/project';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { ProjectStatus } from '@project/common/platform/project';
import { UserPreferencesProjectCancelStrategy } from '@project/common/platform/user';
import { LedgerService } from '@project/module/ledger/service';
import { CryptoDecryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';

@Injectable()
export class PaymentPayHandler extends TransportCommandHandler<IPaymentPayDto, PaymentPayCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    private static DECIMALS = '100';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService, private ledger: LedgerService) {
        super(logger, transport, PaymentPayCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async transactionsCreate(payment: PaymentEntity, paymentAggregator: CompanyEntity, donatedAmount: string, feeAmount: string, coinId: LedgerCoinId, company: CompanyEntity, project?: ProjectEntity): Promise<void> {
        let isProject = !_.isNil(project);

        let feeAggregator = new PaymentTransactionEntity();
        feeAggregator.type = CoinEmitType.FEE_AGGREGATOR_DEDUCTED;
        feeAggregator.amount = feeAmount;
        feeAggregator.coinId = coinId;
        feeAggregator.credit = PaymentAccountId.CL00;
        feeAggregator.debet = PaymentAccountId.AG00;
        feeAggregator.companyId = paymentAggregator.id;

        let donated = new PaymentTransactionEntity();
        donated.type = CoinEmitType.DONATED;
        donated.amount = donatedAmount;
        donated.coinId = coinId;
        donated.credit = PaymentAccountId.CL00;
        donated.debet = PaymentAccountId.AC00;
        donated.projectId = isProject ? project.id : null;
        donated.companyId = isProject ? null : company.id;

        payment.transactions = [feeAggregator, donated];

        if (!isProject) {
            await this.paymentSave(payment, coinId, company.id);
            return;
        }

        let currentBalance = await this.database.getCollectedAmount(coinId, null, project.id);
        let newBalance = MathUtil.add(currentBalance, donatedAmount);
        let requiredBalance = this.balanceRequired(project, coinId);

        let delta = MathUtil.subtract(newBalance, requiredBalance);
        if (MathUtil.lessThan(delta, '0')) {
            await this.paymentSave(payment, coinId, null, project.id);
            return;
        }

        donated.amount = MathUtil.subtract(donatedAmount, delta);

        await this.paymentExtraDonatedTransactionAdd(delta, coinId, payment, project);
        await this.paymentSave(payment, coinId, null, project.id);

        if (project.status === ProjectStatus.ACTIVE && await this.database.isAmountCollected(project.id)) {
            await this.database.projectStatus(project, ProjectStatus.COLLECTED);
        }
    }

    private async paymentExtraDonatedTransactionAdd(amount: string, coinId: LedgerCoinId, payment: PaymentEntity, project: ProjectEntity): Promise<void> {
        let target = await this.getExtraPaymentTarget(payment, project);
        let isProject = target.type === CoinObjectType.PROJECT;

        let donated = new PaymentTransactionEntity();
        donated.type = CoinEmitType.DONATED;
        donated.amount = amount;
        donated.coinId = coinId;
        donated.credit = PaymentAccountId.CL00;
        donated.debet = PaymentAccountId.AC00;
        donated.projectId = isProject ? target.id : null;
        donated.companyId = isProject ? null : target.id;

        payment.transactions.push(donated);
    }

    private async getExtraPaymentTarget(payment: PaymentEntity, project: ProjectEntity): Promise<IPaymentTarget> {
        let strategy = UserPreferencesProjectCancelStrategy.REFUND_TO_COMPANY;
        if (!_.isNil(payment.userId)) {
            let user = await this.database.userGet(payment.userId);
            if (!_.isNil(user.preferences.projectCancelStrategy)) {
                strategy = user.preferences.projectCancelStrategy;
            }
        }
        if (strategy === UserPreferencesProjectCancelStrategy.REFUND_TO_COMPANY) {
            return { id: project.companyId, type: CoinObjectType.COMPANY }
        }
    }

    private async paymentSave(payment: PaymentEntity, coinId: LedgerCoinId, companyId?: number, projectId?: number): Promise<void> {
        payment = await this.database.payment.save(payment);

        let from = null;
        if (!_.isNil(payment.user)) {
            let user = await this.ledger.userAdd(payment.user);
            from = user.ledgerUid;
        }

        for (let transaction of payment.transactions) {
            await this.ledger.coinEmit(transaction, from);
        }
        if (!_.isNil(companyId)) {
            await this.balanceUpdate(coinId, companyId);
        }
        if (!_.isNil(projectId)) {
            await this.balanceUpdate(coinId, null, projectId);
        }
    }

    private balanceRequired(project: ProjectEntity, coinId: LedgerCoinId): string {
        let balance = project.toUserObject().balance;
        let value = !_.isNil(balance.required) ? balance.required[coinId] : null;
        return !_.isNil(value) ? value : '0';
    }

    private async balanceUpdate(coinId: LedgerCoinId, companyId: number = null, projectId: number = null): Promise<void> {
        let item = await this.database.account.findOne({ type: AccountType.COLLECTED, coinId, companyId, projectId });
        if (_.isNil(item)) {
            item = new AccountEntity(AccountType.COLLECTED, coinId, companyId, projectId);
        }
        item.amount = await this.database.getCollectedAmount(coinId, companyId, projectId);
        await this.database.account.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IPaymentPayDto<any>): Promise<void> {
        let item = await this.database.payment.findOne({ referenceId: params.details.referenceId });
        if (!_.isNil(item)) {
            throw new ExtendedError(`Payment with \"referenceId\" already exist`);
        }

        item = new PaymentEntity();
        item.type = params.type;
        item.status = params.status;
        item.details = JSON.stringify(params.data);
        item.transactionId = params.transactionId;
        item.referenceId = params.details.referenceId;

        if (!_.isNil(params.details.userId)) {
            item.user = await this.database.userGet(params.details.userId);
        }

        let project: ProjectEntity = null;
        let company: CompanyEntity = null;
        switch (params.details.target.type) {
            case CoinObjectType.COMPANY:
                company = await this.database.companyGet(params.details.target.id);
                break;
            case CoinObjectType.PROJECT:
                project = await this.database.projectGet(params.details.target.id);
                UserGuard.checkProject({ isProjectRequired: true }, project);
                company = await this.database.companyGet(project.companyId);
                break;
            default:
                throw new UnreachableStatementError(params.details.target.type);
        }

        UserGuard.checkCompany({ isCompanyRequired: true }, company);

        let privateKey = await this.transport.sendListen(new CryptoDecryptCommand({ type: CryptoKeyType.DATABASE, value: company.paymentAggregator.key }));
        if (!PaymentUtil.checkSignature(params.details, privateKey)) {
            throw new ExtendedError(`Invalid signature`);
        }

        let fee = '0';
        let amount = '0';
        let coinId = null;
        switch (params.type) {
            case PaymentAggregatorType.CLOUD_PAYMENTS:
                fee = MathUtil.multiply(params.data.TotalFee, PaymentPayHandler.DECIMALS);
                amount = MathUtil.multiply(params.data.PaymentAmount, PaymentPayHandler.DECIMALS);
                coinId = params.data.PaymentCurrency;
                break;
        }

        let paymentAggregator = await this.ledger.companyPaymentAggregatorGet(item.type);
        UserGuard.checkCompany({ isCompanyRequired: true }, paymentAggregator);

        await this.transactionsCreate(item, paymentAggregator, MathUtil.subtract(amount, fee), fee, coinId, company, project);
    }
}
