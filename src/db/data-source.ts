import { DataSource } from "typeorm";
import { config } from '../config';
import { user } from '../Entity/userEntity';
import { Sender } from '../Entity/senderEntity';
import { EmailBatch } from '../Entity/emailBatchEntity';
import { EmailJob } from '../Entity/emailJobEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: parseInt(config.DB_PORT),
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: config.NODE_ENV === 'development',
  logging: config.NODE_ENV === 'development',
  entities: [user, Sender, EmailBatch, EmailJob],
  migrations: ['src/db/migrations/**/*.ts'],
});
