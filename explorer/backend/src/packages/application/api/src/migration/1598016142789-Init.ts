import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1598016142789 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		const sql = `
			create table "ledger_block_event"
			(
				id serial not null
					constraint "ledger_block_event_id_pkey" primary key,
				uid varchar not null,
				name varchar,
				transaction_hash varchar not null,
				channel varchar not null,
				chaincode varchar,
				data json,
				block_number integer not null,
				created_date timestamp not null,
				block_id integer not null,
				ledger_id integer not null
			);

			create unique index "ledger_block_event_ukey_uid_ledger_id" on ledger_block_event (uid, ledger_id);

			create index "ledger_block_event_ukey_uid_block_id_ledger_id_name" on ledger_block_event (uid, block_id, ledger_id, name);

			create table "ledger_block_transaction"
			(
				id serial not null
					constraint "ledger_block_transaction_id_pkey" primary key,
				uid varchar not null,
				hash varchar not null,
				channel varchar not null,
				block_number integer not null,
				created_date timestamp not null,
				validation_code integer not null,
				chaincode json,
				request json,
				response json,
				request_id varchar,
				request_name varchar,
				request_user_id varchar,
				response_error_code integer,
				block_id integer not null,
				ledger_id integer not null
			);

			alter table ledger_block_transaction owner to "hlf-explorer";

			create unique index "ledger_block_transaction_ukey_uid_ledger_id" on ledger_block_transaction (uid, ledger_id);

			create index "ledger_block_transaction_ukey_hash_block_id_request_id_request_user_id_request_user_id_ledger_id" on ledger_block_transaction (hash, block_id, request_id, request_user_id, ledger_id);

			create table "ledger"
			(
				id serial not null
					constraint "ledger_pkey_id_pkey" primary key,
				name varchar not null,
				block_height integer not null,
				block_frequency integer not null,
				block_height_parsed integer not null
			);

			alter table ledger owner to "hlf-explorer";

			create unique index "ledger_ukey_name" on ledger (name);

			create table "ledger_block"
			(
				id serial not null
					constraint "ledger_block_pkey" primary key,
				uid varchar not null,
				hash varchar not null,
				number integer not null,
				created_date timestamp not null,
				raw_data json not null,
				ledger_id integer not null
					constraint "ledger_block_ledger_id_fkey"
						references ledger
			);

			alter table ledger_block owner to "hlf-explorer";

			create unique index "ledger_block_ukey_uid_ledger_id" on ledger_block (uid, ledger_id);

			create index "ledger_block_ukey_uid_hash_number_ledger_id" on ledger_block (uid, hash, number, ledger_id);
        `;

		await queryRunner.query(sql);
	}

	public async down(queryRunner: QueryRunner): Promise<any> { }
}
