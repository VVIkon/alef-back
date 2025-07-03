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
import type { IRoomProfile, IGroupProfile, INewGroup, IUserProfile } from '../ws/interfaces/websocket-message.interface';

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
				await Promise.all(
					groupProfile?.map(async (grp) => {
						const usersInGroup = await this.custUserRepository.getUsers(grp.users as number[]);
						grp.users =
							usersInGroup?.map((el) => {
								return {
									id: el.id,
									fio: el.fio,
								};
							}) || [];
					}),
				);
				return groupProfile[0];
			}
			return null;
		} catch (error) {
			console.error('MessendoService.getGroup Error: ', error);
			return null;
		}
	}

	async createNewRoom(userId: number, groupUserName: string): Promise<boolean> {
		if (!userId) return false;
		try {
			const ids = (await this.custGroupRepository.getGroupWithOwnerId([userId])) || [];
			const room = await this.custRoomRepository.InsertNewProfile(userId, groupUserName, ids);
			return !!room;
		} catch (error) {
			console.error('MessendoService.createNewRoom Error: ', error);
			return false;
		}
	}

	async getRoom(roomOwnerId: number, roomName: string): Promise<IRoomProfile | null> {
		if (!roomOwnerId) return null;
		try {
			let room = await this.custRoomRepository.getRoomProfile(roomOwnerId);
			if (!room) {
				const ids = (await this.custGroupRepository.getGroupWithOwnerId([roomOwnerId])) || [];
				room = await this.custRoomRepository.InsertNewProfile(roomOwnerId, roomName, ids);
			}
			if (!room) return null;

			const groupOwnerIds = room?.groups || [];
			const groupProfile = await this.custGroupRepository.getGroupProfile(groupOwnerIds);
			if (groupProfile && groupProfile.length) {
				await Promise.all(
					groupProfile?.map(async (grp) => {
						const usersInGroup = await this.custUserRepository.getUsers(grp.users as number[]);
						grp.users =
							usersInGroup?.map((el) => {
								return {
									id: el.id,
									fio: el.fio,
								};
							}) || [];
					}),
				);
			}
			const activeUsers = await this.custUserRepository.getActiveUsers();
			const users: IUserProfile[] = activeUsers.map((el) => {
				return {
					id: el.id,
					fio: el.fio,
				};
			});
			const roomProfile = {
				...room,
				groups: groupProfile,
				users,
			};
			return roomProfile;
		} catch (error) {
			console.error('MessendoService.getRoom Error: ', error);
			return null;
		}
	}
	async getGroupContent(groupId: number): Promise<Content[] | null> {
		if (!groupId) return null;
		try {
			const content = await this.custContentRepository.getGroupContent(groupId);
			return content || null;
		} catch (error) {
			console.error('MessendoService.getGroupContent Error: ', error);
			return null;
		}
	}
	async insertToGroupContent(msgData: {
		sendToGroup: number;
		senderId: number;
		message: string
	}): Promise<Content | null> {
		if (!msgData) return null;
		try {
			const msgToContent = {
				groupId: msgData.sendToGroup,
				userId: msgData.senderId,
				message: msgData.message,
			};

			return await this.custContentRepository.InsertToGroupContent(msgToContent);
		} catch (error) {
			console.error('MessendoService.insertToGroupContent Error: ', error);
			return null;
		}
	}
	async createNewGroup(newGroup: INewGroup): Promise<IGroupProfile | null> {
		if (!newGroup) return null;
		try {
			const groupProfile = await this.custGroupRepository.insertNewGroup(newGroup) || null;
			if (groupProfile?.id) {
				const room = await this.custRoomRepository.getRoomProfileById(newGroup.roomId);
				if (room?.groups) {
					const groupsRoom: number[] = [...room?.groups, ...[groupProfile.id]];
					await this.custRoomRepository.updateRoomGroup(newGroup.roomId, groupsRoom);
				}
			}
			if (groupProfile?.users?.length) {
				const usersInGroup = await this.custUserRepository.getUsers(groupProfile.users as number[]);
				groupProfile.users = usersInGroup?.map((el) => {
					return {
						id: el.id,
						fio: el.fio,
					};
				}) || [];
			}
			return groupProfile;

		} catch (error) {
			console.error('MessendoService.insertToGroupContent Error: ', error);
			return null;
		}
	}
}
