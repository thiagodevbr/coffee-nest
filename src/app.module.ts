import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'prod';
const FILE_ENV = `.env.${ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: FILE_ENV,
    }),
    CoffeesModule,
    TypeOrmModule.forRoot({
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      synchronize: process.env.NODE_ENV ? true : false,
      autoLoadEntities: true,
      type: 'postgres',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
