import { ConfigService } from '@nestjs/config';
import type {TypeOrmModuleOptions} from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig = (configService: ConfigService) : TypeOrmModuleOptions => ( {
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASS'),
    database: configService.get('DATABASE_NAME'),
    ssl: true, // required
    entities: [join(__dirname + '../../**/*.entity.{js,ts}')], // dist\\**\\*.entity.{js,ts}'
    synchronize: true // use only on development
})