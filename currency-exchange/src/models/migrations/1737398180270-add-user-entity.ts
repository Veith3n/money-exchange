import { MigrationInterface } from 'typeorm/migration/MigrationInterface';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

export class AddUserEntity1737398180270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
      "id" SERIAL NOT NULL, 
      "email" character varying NOT NULL, 
      "password" character varying NOT NULL, 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
      CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
