import { MigrationInterface } from 'typeorm/migration/MigrationInterface';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

export class AddWalletEntity1737669740161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet" (
      "id" SERIAL NOT NULL, 
      "user_id" integer NOT NULL, 
      "currency_code" character varying NOT NULL, 
      "balance" character varying NOT NULL, 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_72548a47ac4a996cd254b082522" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_72548a47ac4a996cd254b082522"`,
    );
    await queryRunner.query(`DROP TABLE "wallet"`);
  }
}
