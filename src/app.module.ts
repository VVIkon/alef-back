import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSource } from './common/db/data-source';

import { UserController } from './modules/user/users.controller';
import { UsersModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	controllers: [UserController],
	imports: [
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const dataSource = getDataSource(configService);
				return dataSource.options;
			},
		}),
		AuthModule,
	],
	providers: [],
})
export class AppModule {}
