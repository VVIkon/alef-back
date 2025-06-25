import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/db/entities/users.entity';
import { Room } from '../../common/db/entities/room.entity';
import { Group } from '../../common/db/entities/group.entity';
import { Content } from '../../common/db/entities/content.entity';
import { RoomRepository } from './room.repository';
import { GroupRepository } from './group.repository';
import { UserRepository } from '../user/user.repository';
import { ContentRepository } from './content.repository';
import type { IRoomProfile } from '../ws/interfaces/websocket-message.interface';
import type { IGroupProfile } from '../ws/interfaces/websocket-message.interface';

@Injectable()
export class MessendoService {
	constructor(
		@InjectRepository(Room)
		private roomRepository: Repository<Room>,

		@InjectRepository(Group)
		private groupRepository: Repository<Group>,

		@InjectRepository(User)
		private userRepository: Repository<User>,

		@InjectRepository(Content)
		private contentRepository: Repository<Content>,

		private readonly custRoomRepository: RoomRepository,
		private readonly custGroupRepository: GroupRepository,
		private readonly custUserRepository: UserRepository,
		private readonly custContentRepository: ContentRepository,
	) {}

	async getGroup(groupId: number): Promise<IGroupProfile | null> {
		if (!groupId) return null;
		try {
			const groupProfile = await this.custGroupRepository.getGroupProfile([groupId]);
			if (groupProfile && groupProfile.length) {
				await Promise.all(groupProfile?.map(async (grp) => (grp.users = await this.custUserRepository.getUsers(grp.users as number[]))));
				return groupProfile[0];
			}
			return null;
		} catch (error) {
			console.error('MessendoService.getGroup Error: ', error);
			return null;
		}
	}

	async getRoom(roomOwnerId: number): Promise<IRoomProfile | null> {
		if (!roomOwnerId) return null;
		try {
			const room = await this.custRoomRepository.getRoomProfile(roomOwnerId);
			if (!room || !room?.groups?.length) return null;

			const groupOwnerIds = room.groups;
			const groupProfile = await this.custGroupRepository.getGroupProfile(groupOwnerIds);
			if (groupProfile && groupProfile.length) {
				await Promise.all(groupProfile?.map(async (grp) => (grp.users = await this.custUserRepository.getUsers(grp.users as number[]))));
			}
			const roomProfile = {
				...room,
				groups: groupProfile,
			};
			return roomProfile;
		} catch (error) {
			console.error('MessendoService.getRoom Error: ', error);
			return null;
		}
	}
	async getGroupContent(groupId): Promise<Content[] | null> {
		if (!groupId) return null;
		try {
			const content = await this.custContentRepository.getGroupContent(groupId);
			return content || null;
		} catch (error) {
			console.error('MessendoService.getGroupContent Error: ', error);
			return null;
		}
	}
	async insertToGroupContent(msgData): Promise<boolean> {
		if (!msgData) return false;
		try {
			const msgToContent = {
				groupId: msgData.sendToGroup,
				userId: msgData.senderId,
				message: msgData.message,
			};

			await this.custContentRepository.InsertToGroupContent(msgToContent);
			return true;
		} catch (error) {
			console.error('MessendoService.insertToGroupContent Error: ', error);
			return false;
		}
	}
	async createNewRoom(userId: number, groupUserName: string): Promise<boolean> {
		try {
			const ids = await this.custGroupRepository.getGroupWithOwnerId([userId]);
			await this.custRoomRepository.InsertNewProfile(userId, groupUserName, ids || []);
			return true;
		} catch (error) {
			console.error('MessendoService.createNewRoom Error: ', error);
			return false;
		}
	}
}
