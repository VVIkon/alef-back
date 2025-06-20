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
		return [
			...groupProfile,
		];
	}
}
