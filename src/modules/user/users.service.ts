import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Users } from '../../common/db/entities/users.entity';
// import type { IUser } from './interfaces/IUser';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private userRepository: Repository<Users>,
	) {}

	async findAll(): Promise<Users[]> {
		const users = await this.userRepository.find();
		return users;
	}

	public async findById(id: number): Promise<Users | null> {
		const user = await this.userRepository.findOneBy({ id });
		return !user ? null : user;
	}
	async create(userData: Omit<Users, 'id'>): Promise<Users> {
		const user = this.userRepository.create(userData);
		return await this.userRepository.save(user);
	}
	async deleteUser(id: number): Promise<DeleteResult> {
		const deleteResult = await this.userRepository.delete({ id });
		return deleteResult;
	}
}
