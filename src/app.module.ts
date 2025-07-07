import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSource } from './common/db/data-source';

import { UserController } from './modules/user/users.controller';
import { UsersModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
// import { MessendoModule } from './modules/messendo/messendo.module';
import { WebSocketModule } from './modules/ws/websocket.module';

@Module({
	controllers: [UserController],
	imports: [
		UsersModule,
		// MessendoModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const dataSource = await getDataSource(configService);
				return dataSource.options;
			},
		}),
		AuthModule,
		forwardRef(() => WebSocketModule),
	],
	providers: [],
})
export class AppModule {}
