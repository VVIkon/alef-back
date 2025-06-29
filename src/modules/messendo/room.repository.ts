import { DataSource, Repository } from 'typeorm';
import { Room } from '../../common/db/entities/room.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomRepository extends Repository<Room> {
	constructor(private dataSource: DataSource) {
		super(Room, dataSource.createEntityManager());
	}

	public async getRoomProfile(roomOwnerId: number): Promise<Room | null> {
		const room = await this.createQueryBuilder('rooms')
			.where('rooms.userId = :roomOwnerId and rooms.active = 1', { roomOwnerId })
			.getOneOrFail();
		return room || null;
	}

	public async InsertNewProfile(userId: number, groupUserName: string, ids: number[]): Promise<void> {
		if (!userId) return;
		await this.createQueryBuilder()
			.insert()
			.into(Room)
			.values({
				name: `${groupUserName} Group`,
				userId,
				groups: ids || [],
				users: [],
				channels: [],
				active: 1,
			})
			.execute();
	}
}
