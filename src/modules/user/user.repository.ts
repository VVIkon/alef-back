import { DataSource, Repository } from 'typeorm';
import { User } from '../../common/db/entities/users.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	// active
	async getActiveUsers(status: number = 1): Promise<User[]> {
		return await this.createQueryBuilder('users')
			.where('users.active = :isActive', { isActive: status })
			.orderBy('users.id')
			.getMany();
	}

	async getUserByEmail(mail: string): Promise<User | null> {
		return await this.createQueryBuilder('users')
			// .select(['users.id', 'users.fio', 'users.password'])
			.where('users.email = :mail', { mail })
			.getOneOrFail();
	}

	async checkUserByToken(id: number, token: string): Promise<boolean> {
		try {
			const result = await this.createQueryBuilder('users')
				.where('users.id = :id and users.token = :token', { id, token })
				.getOneOrFail();
			return !!result;
		} catch (error) {
			console.log(error.message);
			return false;
		}
	}
	async updateUserByid(user: User): Promise<boolean> {
		try {
			const { id, ...userData } = user;
			// userData.roles = '{"admin", "owner"}';
			console.log(userData);
			const result = await this.createQueryBuilder()
				.update('users')
				.set(userData)
				.where('id = :id', { id })
				.execute();

			return !!result.affected;
		} catch (error) {
			console.log(error.message);
			return false;
		}
	}
}
