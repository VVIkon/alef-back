import { DataSource, Repository, EntityManager } from 'typeorm';
import { User } from '../../common/db/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(dataSourceOrManager: DataSource | EntityManager) {
		super(
			User,
			dataSourceOrManager instanceof DataSource ? dataSourceOrManager.createEntityManager() : dataSourceOrManager,
		);
	}

	// active
	async getActiveUsers(status: number = 1): Promise<User[]> {
		if (!status) return [];
		return await this.createQueryBuilder('users')
			.where('users.active = :isActive', { isActive: status })
			.orderBy('users.id')
			.getMany();
	}

	async getUserByEmail(mail: string): Promise<User | null> {
		if (!mail) return null;
		return await this.createQueryBuilder('users').where('users.email = :mail', { mail }).getOneOrFail();
	}
	async getUserByLogin(login: string): Promise<User | null> {
		if (!login) return null;
		return await this.createQueryBuilder('users').where('users.login = :login', { login }).getOneOrFail();
	}

	async checkUserByToken(id: number, token: string): Promise<boolean> {
		if (!id) return false;
		try {
			const result = await this.createQueryBuilder('users')
				.where('users.id = :id and users.token = :token', { id, token })
				.getOneOrFail();
			return !!result;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	}
	async getUsers(ids: number[]): Promise<User[] | null> {
		if (!ids?.length) return null;
		try {
			const result = await this.createQueryBuilder('users')
				.where('users.id IN (:...ids)', { ids })
				.andWhere('users.active = 1')
				.getMany();

			return result;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	}
	async updateUserByid(user: User): Promise<boolean> {
		try {
			const { id, ...userData } = user;
			const result = await this.createQueryBuilder()
				.update('users')
				.set(userData)
				.where('id = :id', { id })
				.execute();

			return !!result.affected;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	}
}
