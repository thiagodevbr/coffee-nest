import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

type IDatabaseInfo = {
  host: string;
  port: number;
  username: string;
  database: string;
  password: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
};

export const dataBaseConfig: IDatabaseInfo = {
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  synchronize: Boolean(process.env.SYNCHRONIZE),
  autoLoadEntities: Boolean(process.env.DATABASE_AUTO_LOAD_ENTITIES),
};
