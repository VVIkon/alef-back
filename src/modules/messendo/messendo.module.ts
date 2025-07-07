import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../common/db/entities/users.entity';
import { Group } from '../../common/db/entities/group.entity';
import { Room } from '../../common/db/entities/room.entity';
import { Content } from '../../common/db/entities/content.entity';
import { MessendoService } from './messendo.service';
// import { MessendoController } from './messendo.controller';
import { UserRepository } from '../user/user.repository';
import { UsersService } from '../user/users.service';
import { RoomRepository } from './room.repository';
import { GroupRepository } from './group.repository';
import { ContentRepository } from './content.repository';
import { WebSocketGateWay } from '../ws/websocket.gateway';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([
		User,
		Room,
		Group,
		Content
	])],
	providers: [
		{
			provide: RoomRepository,
			useFactory: (dataSource: DataSource) => new RoomRepository(dataSource),
			inject: [DataSource],
		},
		{
			provide: GroupRepository,
			useFactory: (dataSource: DataSource) => new GroupRepository(dataSource),
			inject: [DataSource],
		},
		{
			provide: UserRepository,
			useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
			inject: [DataSource],
		},
		{
			provide: ContentRepository,
			useFactory: (dataSource: DataSource) => new ContentRepository(dataSource),
			inject: [DataSource],
		},
		MessendoService,
		UsersService,
		JwtService,
	],
	controllers: [],
	exports: [MessendoService, JwtService],
})
export class MessendoModule {}
