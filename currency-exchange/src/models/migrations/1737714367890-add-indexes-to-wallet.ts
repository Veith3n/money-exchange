import { MigrationInterface } from 'typeorm/migration/MigrationInterface';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

export class AddIndexesToWallet1737714367890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "wallet__userid" ON "wallet" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "wallet__currency_code" ON "wallet" ("currency_code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "wallet__user_id_currency_code_unique" ON "wallet" ("user_id", "currency_code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."wallet__user_id_currency_code_unique"`,
    );
    await queryRunner.query(`DROP INDEX "public"."wallet__currency_code"`);
    await queryRunner.query(`DROP INDEX "public"."wallet__userid"`);
  }
}
