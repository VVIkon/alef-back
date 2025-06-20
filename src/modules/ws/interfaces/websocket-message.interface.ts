import type { CreateUsersDTO } from '../../user/DTO/createUsers.dto';

export interface WebSocketMessage<T = any> {
	event: string;
	data: T;
}

export interface IGroupProfile {
	id: number;
	nameGroup: string;
	typeGroup: string;
	userId: number;
	users: number[] | CreateUsersDTO[] | null;
	moderators: number[] | null;
	active: number;
	readOnly: number;
	dateCreate: Date;
}

export interface IRoomProfile {
	id: number;
	name: string;
	userId: number;
	groups: IGroupProfile[] | null;
	users: number[] | null;
	channels: number[] | null;
	active: number;
	dateCreate: Date;
}
