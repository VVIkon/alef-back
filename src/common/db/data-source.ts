import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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

