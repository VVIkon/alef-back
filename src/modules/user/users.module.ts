import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/db/entities/users.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from './user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([User])], // регистрируем сущность
	providers: [UsersService, UserRepository],
	controllers: [UserController],
	exports: [UsersService, UserRepository],
})
export class UsersModule {}
