import type { CreateUsersDTO } from '../../user/DTO/createUsers.dto';

export interface WebSocketMessage<T = any> {
	event: string;
	data: T;
}

export interface IUserProfile {
	id: number;
	fio: string;
}

export interface INewGroup {
	roomId: number,
	nameGroup: string;
	typeGroup: 'public' | 'private' | 'hidden';
	userId: number;
	users: number[];
	moderators: number[],
	active: number,
	readOnly: number;
}

export interface IGroupProfile {
	id?: number;
	nameGroup: string;
	typeGroup: string;
	userId: number;
	users: number[] | IUserProfile[] | null;
	moderators: number[] | null;
	active: number;
	readOnly: number;
	dateCreate?: Date;
	hasMessage?: boolean;
}

export interface IRoomProfile {
	id: number;
	name: string;
	userId: number;
	groups: IGroupProfile[] | null;
	users: number[] | IUserProfile[] | null;
	channels: number[] | null;
	active: number;
	dateCreate: Date;
}

export interface IMessage {
	token?: string;
	message: string | null;
	sendToGroup: number;
	groupName: string | null;
	senderId: number;
	senderName: string | null;
	dateCreate?: Date | null;
}
