import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../../common/db/entities/users.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly custUserRepository: UserRepository,
	) {}

	async getActiveUser(): Promise<User[]> {
		const users = await this.custUserRepository.getActiveUsers();
		return users;
	}

	async getUserByEmail(mail: string): Promise<User | null> {
		const user = await this.custUserRepository.getUserByEmail(mail);
		return user;
	}

	async getUserByToken(id: number, token: string): Promise<boolean> {
		const result = await this.custUserRepository.checkUserByToken(
			id,
			token,
		);
		return result;
	}

	public async findById(id: number): Promise<User | null> {
		const user = await this.userRepository.findOneBy({ id });
		return !user ? null : user;
	}
	async create(userData: Omit<User, 'id'>): Promise<User> {
		const user = this.userRepository.create(userData);
		return await this.userRepository.save(user);
	}
	async updateUserByid(user: User): Promise<User | boolean> {
		return await this.custUserRepository.updateUserByid(user);
	}
	async deleteUser(id: number): Promise<DeleteResult> {
		const deleteResult = await this.userRepository.delete({ id });
		return deleteResult;
	}
}
