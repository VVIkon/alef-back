import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config();

// Для использования .env (опционально)
export const getDataSource = (configService: ConfigService) => {
	return new DataSource({
		type: 'postgres',
		host: configService.get<string>('DB_HOST', '192.168.1.104'),
		port: configService.get<number>('DB_PORT', 5432),
		username: configService.get<string>('DB_USER'),
		password: configService.get<string>('DB_PASSWORD'),
		database: configService.get<string>('DB_NAME'),
		entities: [__dirname + '/entities/*.entity{.ts,.js}'],
		synchronize: false,
		logging: true, // Логирование запросов
	});
};

// AppDataSource - работает только при минрациях
export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '5432', 10),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [__dirname + '/entities/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/*{.ts,.js}'],
	migrationsRun: false,
	synchronize: false,
});
