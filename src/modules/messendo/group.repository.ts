import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Group } from '../../common/db/entities/group.entity';
import type { IGroupProfile } from '../ws/interfaces/websocket-message.interface';

@Injectable()
export class GroupRepository extends Repository<Group> {
	constructor(private dataSource: DataSource) {
		super(Group, dataSource.createEntityManager());
	}

	async getGroupProfile(groupOwnerIds: number[] | null): Promise<IGroupProfile[] | null> {
		if (!groupOwnerIds?.length) return null;

		const groupProfile = await this.createQueryBuilder('groups')
			.where('groups.id IN (:...groupOwnerIds)', { groupOwnerIds })
			.andWhere('groups.active = 1')
			.getMany();
		if (!groupProfile?.length) {
			return null;
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

	// SELECT json_agg(id) FROM public."groups" where users @> ARRAY[12]::int[]
}
