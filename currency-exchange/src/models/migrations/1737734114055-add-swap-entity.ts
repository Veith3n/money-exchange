import { MigrationInterface } from 'typeorm/migration/MigrationInterface';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

export class AddSwapEntity1737734114055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "swap"
                             (
                                 "id"                    SERIAL            NOT NULL,
                                 "user_id"               integer           NOT NULL,
                                 "bought_currency_code"  character varying NOT NULL,
                                 "bought_currency_value" double precision  NOT NULL,
                                 "sold_currency_code"    character varying NOT NULL,
                                 "sold_currency_value"   double precision  NOT NULL,
                                 "exchange_rate"         double precision  NOT NULL,
                                 "created_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_4a10d0f359339acef77e7f986d9" PRIMARY KEY ("id")
                             )`);

    await queryRunner.query(
      `CREATE INDEX "swap__userid" ON "swap" ("user_id") `,
    );
    await queryRunner.query(`ALTER TABLE "swap"
        ADD CONSTRAINT "FK_085918705c8c599cc361007edee" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "FK_085918705c8c599cc361007edee"`,
    );
    await queryRunner.query(`DROP INDEX "public"."swap__userid"`);
    await queryRunner.query(`DROP TABLE "swap"`);
  }
}
