import { EntityManager, DataSource, Repository } from 'typeorm';
import { Room } from '../../common/db/entities/room.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomRepository extends Repository<Room> {
	constructor(dataSourceOrManager: DataSource | EntityManager) {
		super(
			Room,
			dataSourceOrManager instanceof DataSource ? dataSourceOrManager.createEntityManager() : dataSourceOrManager,
		);
	}

	/**
	 * Профиль кабинета по id владельца
	 * @param roomOwnerId
	 * @returns
	 */
	public async getRoomProfile(roomOwnerId: number): Promise<Room | null> {
		const room = await this.createQueryBuilder('rooms')
			.where('rooms.userId = :roomOwnerId and rooms.active = 1', { roomOwnerId })
			.getOne();
		return room || null;
	}
	/**
	 * Профиль кабинета по id кабинета
	 * @param roomId
	 * @returns
	 */
	public async getRoomProfileById(roomId: number): Promise<Room | null> {
		const room = await this.createQueryBuilder('rooms').where('rooms.id = :id', { id: roomId }).getOne();
		return room || null;
	}

	public async InsertNewProfile(userId: number, groupUserName: string, ids: number[]): Promise<Room | null> {
		if (!userId) return null;
		const room = await this.createQueryBuilder()
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
			.returning('*')
			.execute();
		return room.raw[0];
	}
	/**
	 * Обновляет группу к кабинета
	 * @param roomId
	 * @param groupIds
	 * @returns
	 */
	public async updateRoomGroup(roomId: number, groupIds: number[]): Promise<Room | null> {
		if (!groupIds?.length) return null;
		const room = await this.createQueryBuilder()
			.update(Room)
			.set({
				groups: groupIds || [],
			})
			.where('id = :id', { id: roomId })
			.returning('*')
			.execute();
		return room.raw[0];
	}
}
