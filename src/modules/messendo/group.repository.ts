import { DataSource, Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Group } from '../../common/db/entities/group.entity';
import { User } from '../../common/db/entities/users.entity';
import type { IGroupProfile, INewGroup, IUserProfile } from '../ws/interfaces/websocket-message.interface';

@Injectable()
export class GroupRepository extends Repository<Group> {
	constructor(dataSourceOrManager: DataSource | EntityManager) {
		super(
			Group,
			dataSourceOrManager instanceof DataSource ? dataSourceOrManager.createEntityManager() : dataSourceOrManager,
		);
	}
	/**
	 * Создает новую группу
	 * @param groupParams
	 * @returns
	 */
	async insertNewGroup(groupParams: INewGroup): Promise<IGroupProfile | null> {
		if (!groupParams) return null;
		const newGroup = await this.createQueryBuilder()
			.insert()
			.into(Group)
			.values({
				nameGroup: groupParams.nameGroup,
				typeGroup: groupParams.typeGroup,
				userId: groupParams.userId,
				users: groupParams.users,
				moderators: groupParams.moderators,
				active: groupParams.active,
				readOnly: groupParams.readOnly,
				dateCreate: () => 'NOW()',
			})
			.returning('*')
			.execute();
		return newGroup.raw[0] || null;
	}
	/**
	 * Обновляет данные группы
	 * @param groupParams
	 * @returns
	 */
	async updateGroup(groupParams: INewGroup): Promise<IGroupProfile | null> {
		if (!groupParams) return null;
		const group = await this.createQueryBuilder()
			.update(Group)
			.set({
				nameGroup: groupParams.nameGroup,
				typeGroup: groupParams.typeGroup,
				userId: groupParams.userId,
				users: groupParams.users,
				moderators: groupParams.moderators,
				active: groupParams.active,
				readOnly: groupParams.readOnly,
			})
			.where('id = :id', { id: groupParams.groupId })
			.returning('*')
			.execute()
		return group.raw[0] || null;
	}

	async getGroupProfile(groupOwnerIds: number[] | null): Promise<IGroupProfile[]> {
		if (!groupOwnerIds?.length) return [];

		const groupProfile = await this.createQueryBuilder('groups')
			.where('groups.id IN (:...groupOwnerIds)', { groupOwnerIds })
			.andWhere('groups.active = 1')
			.getMany();
		if (!groupProfile?.length) {
			return [];
		}
		for (const el of groupProfile) {
			el['hasMessage'] = false;
		}
		return groupProfile as IGroupProfile[];
	}
	/**
	 * Добыть все группы в которых участвует
	 */
	async getGroupWithOwnerId(userGroupIds: number[] | null): Promise<number[] | null> {
		if (!userGroupIds?.length) return null;
		const { ids } = await this.createQueryBuilder('gr')
			.select('json_agg(gr.id) as ids')
			.where('gr.users @> ARRAY[:...userGroupIds]::int[]', { userGroupIds })
			.getRawOne();
		return ids;
	}
	/**
	 * поднять все группы в которых встречаются пользователи с ролью, например ['bot']
	 * @param userGroupIds
	 * @returns
	 */
	async getGroupWithUserRoles(userRoles: string[] = ['bot']): Promise<number[] | null> {
		if (!userRoles) return null;
		const { ids } = await this.createQueryBuilder('g')
			.select('json_agg(g.id::int) as ids')
			.leftJoin(User, 'u', 'g.users @> ARRAY[u.id]::int[]')
			.where('u.roles @> ARRAY[:...userRoles]::text[]', { userRoles })
			.getRawOne();
		return ids;
	}
	/**
	 * есть ли в группе пользователь с ролью например ['bot']
	 * @param userGroupIds
	 * @returns
	 */
	async getUsersInGroupWithRoles(group: number, userRoles: string[] = ['bot']): Promise<IUserProfile[] | null> {
		if (!userRoles) return null;
		const userBot = await this.createQueryBuilder('g')
			.select(['u.id', 'u.fio'])
			.leftJoin(User, 'u', 'g.users @> ARRAY[u.id]::int[]')
			.where('u.roles @> ARRAY[:...userRoles]::text[]', { userRoles })
			.andWhere('g.id = :group', { group })
			.getRawMany();
		if (userBot?.length) {
			return userBot.map((el) => ({ id: el.u_id, fio: el.u_fio }));
		}
		return null;
	}
}
