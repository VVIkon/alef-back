import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../common/db/entities/users.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Users])], // регистрируем сущность
	providers: [UsersService],
	controllers: [UserController],
	exports: [UsersService],
})
export class UsersModule {}
