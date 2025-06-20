import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Content } from '../../common/db/entities/content.entity';
import { User } from '../../common/db/entities/users.entity';
import { Group } from '../../common/db/entities/group.entity';
// import type { IGroupProfile } from '../ws/interfaces/websocket-message.interface';

@Injectable()
export class ContentRepository extends Repository<Content> {
	constructor(private dataSource: DataSource) {
		super(Content, dataSource.createEntityManager());
	}

	async getGroupContent(contentsGroupId: number | null): Promise<Content[] | null> {
		if (!contentsGroupId) return null;

		const groupProfile = await this.createQueryBuilder('c')
			.select([
				'c.id as id',
				'c.groupId as groupId',
				'g.nameGroup as groupName',
				'c.userId as userId',
				'u.fio as userName',
				'c.message as message',
				'c.active as active',
				'c.dateCreate as dateCreate'
			])
		    .leftJoin(User, 'u', 'u.id = c.userId')
		    .leftJoin(Group, 'g', 'g.id = c.groupId')
			.where('c.groupId = :contentsGroupId', { contentsGroupId })
			.andWhere('c.active = 1')
			.orderBy('c.id')
			.limit(500)
			.getRawMany();
		return groupProfile || null;
	}
}
