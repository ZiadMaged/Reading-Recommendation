import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleAsyncOptions,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export function getConfig(): SequelizeModuleAsyncOptions {
  return {
    useFactory: (configService: ConfigService<NodeJS.ProcessEnv>) => {
      return getEnvData(configService);
    },
    inject: [ConfigService],
  };
}

function getEnvData(
  configService: ConfigService<NodeJS.ProcessEnv>,
): SequelizeModuleOptions {
  return {
    dialect: configService.get('DB_DIALECT') as Dialect,
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    autoLoadModels: true,
    synchronize: 'true' === configService.get('DB_SYNC'),
    ...('true' === configService.get('DB_SYNC') && {
      sync: {
        alter: true, //ALTER TABLE
        force: false, //DROP TABLE IF EXISTS
      },
    }),
    ...('true' === configService.get('DB_LOGGING') && {
      logging: console.log,
    }),
  };
}
