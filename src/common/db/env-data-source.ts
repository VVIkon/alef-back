import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

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
