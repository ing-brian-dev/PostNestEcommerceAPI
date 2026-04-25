import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { SeederService } from './seeder.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            useFactory: typeOrmConfig,
            inject: [ConfigService]
        })
    ],
    providers: [SeederService]
})
export class SeederModule { }
