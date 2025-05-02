import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSource } from './common/db/data-source';

import { UserController } from './modules/user/users.controller';
// import { UsersService } from './modules/user/users.service';
import { UsersModule } from './modules/user/users.module';
// import { Users } from './modules/user/users.entity';

// import { PersonController } from './modules/person/person.controller';
// import { PersonService } from './modules/person/person.service';

@Module({
	controllers: [UserController],
	// providers: [UsersService],
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
		// TypeOrmModule.forRootAsync({
		// 	imports: [ConfigModule], // Явно указываем зависимость
		// 	inject: [ConfigService], // Внедряем ConfigService
		// 	useFactory: (configService: ConfigService) => ({
		// 		type: 'postgres',
		// 		host: configService.get<string>('DB_HOST', '192.168.1.104'),
		// 		port: configService.get<number>('DB_PORT', 5432),
		// 		username: configService.get<string>('DB_USER'),
		// 		password: configService.get<string>('DB_PASSWORD'),
		// 		database: configService.get<string>('DB_NAME'),
		// 		entities: [__dirname + '/**/*.entity{.ts,.js}'],
		// 		autoLoadEntities: true,
		// 		migrations: [__dirname + '/migrations/*{.ts,.js}'],
		// 		migrationsRun: false,
		// 		cli: {
		// 			migrationsDir: 'src/migrations',
		// 		},
		// 		synchronize: false,
		// 		logging: true, // Логирование запросов
		// 	}),
		// }),
		// TypeOrmModule.forFeature([Users]), // Регистрируем сущность
	],
})
export class AppModule {}
