import { MigrationInterface, QueryRunner } from 'typeorm';
import * as _ from 'lodash';
import { Ed25519, RandomUtil } from '@ts-core/common';
import { LedgerService } from '@project/module/ledger/service';
import { CompanyEntity, CompanyPreferencesEntity } from '@project/module/database/company';
import { CompanyStatus, CompanyType } from '@project/common/platform/company';
import { CompanyPaymentAggregatorEntity } from '@project/module/database/company/CompanyPaymentAggregatorEntity';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { UserRoleEntity } from '@project/module/database/user';
import { LedgerCompanyRole } from '@project/common/ledger/role';

export class AddDefaultCompany1627121260001 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        let repository = queryRunner.connection.getRepository(CompanyEntity);
        let ledgerUid = LedgerService.COMPANY_ROOT_LEDGER_UID;

        let item = await repository.findOneBy({ ledgerUid } as any);
        if (!_.isNil(item)) {
            return;
        }

        item = new CompanyEntity();
        item.type = CompanyType.NKO;
        item.status = CompanyStatus.ACTIVE;
        item.ledgerUid = ledgerUid;

        let preferences = item.preferences = new CompanyPreferencesEntity();
        preferences.name = 'Karma Platform Company';
        preferences.title = preferences.description = preferences.nameShort = preferences.ceo = preferences.inn = preferences.kpp = preferences.ogrn = preferences.address = 'Karma';
        preferences.founded = new Date();

        preferences.picture = 'https://i.picsum.photos/id/1009/200/200.jpg?hmac=2D10SFaYliFjzL4jp_ZjLmZ1_2jaJw89CntiJGjdlGE';

        item.paymentAggregator = new CompanyPaymentAggregatorEntity({ uid: RandomUtil.randomString(), type: PaymentAggregatorType.CLOUD_PAYMENTS });
        item.paymentAggregator.key = RandomUtil.randomString();

        await queryRunner.connection.transaction(async manager => {
            let companyRepository = manager.getRepository(CompanyEntity);
            let roleRepository = manager.getRepository(UserRoleEntity);

            item = await companyRepository.save(item);
            await roleRepository.save(Object.values(LedgerCompanyRole).map(name => new UserRoleEntity(1, name, item.id)));
        });
        return item;
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }
}
