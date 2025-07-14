import { DataSource, Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../../common/db/entities/content.entity';
import { User } from '../../common/db/entities/users.entity';
import { Group } from '../../common/db/entities/group.entity';
// import type { IGroupProfile } from '../ws/interfaces/websocket-message.interface';

@Injectable()
export class ContentRepository extends Repository<Content> {
	constructor(dataSourceOrManager: DataSource | EntityManager) {
		super(
			Content,
			dataSourceOrManager instanceof DataSource ? dataSourceOrManager.createEntityManager() : dataSourceOrManager,
		);
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
				'c.dateCreate as dateCreate',
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

	async InsertToGroupContent(msgToContent): Promise<Content | null> {
		if (!msgToContent) return null;
		const groupContent = await this.createQueryBuilder()
			.insert()
			.into(Content)
			.values({
				groupId: msgToContent.groupId,
				userId: msgToContent.userId,
				message: msgToContent.message,
				active: 1,
				dateCreate: () => 'NOW()',
			})
			.returning('*')
			// .returning(['id', 'groupId', 'userId', 'message', 'active', 'dateCreate'])
			.execute();
		return groupContent.raw[0];
	}
}
