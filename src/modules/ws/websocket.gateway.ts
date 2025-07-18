import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { Server, WebSocket } from 'ws';
import { AuthenticatedWebSocket } from './interfaces/authenticated-websocket.interface';
import { WebSocketMessage, INewGroup } from './interfaces/websocket-message.interface';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { MessendoService } from '../messendo/messendo.service';


@WebSocketGateway(8080, {
	path: '/ws',
	cors: {
		origin: '*',
	},
	transports: ['websocket'],
})
export class WebSocketGateWay implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('WebSocketGateway');
	private clients: Map<string, AuthenticatedWebSocket> = new Map();

	constructor(
		private messendoService: MessendoService,
		// private readonly configService: ConfigService,
	) {}

	handleConnection(client: AuthenticatedWebSocket) {
		this.logger.log(`handleConnection. Client connected: ${client}`);
		// console.trace(); // откуда приходит соединение
	}
	handleDisconnect(client: AuthenticatedWebSocket) {
		if (client.user) {
			this.clients.delete(client.user.sub);
			this.logger.log(`handleDisconnect. Client disconnected: ${client.user.fio}`);
			this.broadcast('userDisconnected', { userId: client.user.sub });
		}
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('authenticate')
	handleAuth(@ConnectedSocket() client: AuthenticatedWebSocket) {
		let data = {};
		const userId = client.user?.sub;
		if (!userId) return;

		if (client?.user?.sub) {
			const user = client.user;
			this.clients.set(user.sub.toString(), client);
			this.logger.log(`handleAuth. Client authenticated: ${user.fio || ''}`);
			data = { success: true, user };
		}
		return { event: 'authenticated', data };
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMessage')
	async handleMessage(@ConnectedSocket() client: AuthenticatedWebSocket, @MessageBody() data: any) {
		// const senderId = data?.senderId || 0;
		// console.log(`>>> client.user: `, client?.user || '!!')
		// console.log(`>>> data: `, data)
		const insertedContent = await this.messendoService.insertToGroupContent(data);
		data.dateCreate = insertedContent?.dateCreate || null;
		this.broadcast('newMessage', data);
		// Если в группе есть bot
		const botData = await this.messendoService.prepareMessageForBot(data);
		if(botData){
			for await (const data of botData) {
				const insertedContent = await this.messendoService.insertToGroupContent(data);
				data.dateCreate = insertedContent?.dateCreate || null;
				this.broadcast('newMessage', data);
			}
		}
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getRoomProfile')
	async getRoomProfile(@ConnectedSocket() client: AuthenticatedWebSocket, @MessageBody() data: any) {
		// if (data.message !== 'getRoomProfile') {
		// 	return this.broadcast('roomProfile', {
		// 		userId: client?.user?.sub || '',
		// 		username: client?.user?.fio || '',
		// 		message: '',
		// 		hasMessage: false,
		// 	});
		// }
		const roomOwnerId = Number(client?.user?.sub) || 0;
		const roomOwnerName = client?.user?.fio || '';
		const roomProfile = await this.messendoService.getRoom(roomOwnerId, roomOwnerName);

		this.broadcast('roomProfile', {
			userId: client?.user?.sub || '',
			username: client?.user?.fio || '',
			message: roomProfile || '',
			hasMessage: false,
		});
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('createNewRoom')
	async createNewRoom(@ConnectedSocket() client: AuthenticatedWebSocket, @MessageBody() data: any) {
		const userId = String(client?.user?.sub) || '0';
		const username = client?.user?.fio || '';
		if (!data || data.message !== 'createNewRoom') {
			return this.broadcast('newRoom', {
				userId,
				username,
				message: '',
			});
		}
		data.message = await this.messendoService.createNewRoom(Number(userId), username);
		this.sendToUser(userId, 'newRoom', data);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('getGroupContent')
	async getGroupContent(@ConnectedSocket() client: AuthenticatedWebSocket, @MessageBody() data: any) {
		if (!data || data.message !== 'getGroupContent') {
			return this.broadcast('getGroupContent', {
				userId: client?.user?.sub || '',
				username: client?.user?.fio || '',
				message: '',
			});
		}
		const groupId = data?.groupId || 0;
		data.message = await this.messendoService.getGroupContent(groupId);
		const authUserId = data.authUserId.toString()
		// console.log(`>>> getGroupContent data: `, data)
		this.sendToUser(authUserId, 'groupContent', data);
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage('setGroupOper')
	async createNewGroup(@ConnectedSocket() client: AuthenticatedWebSocket, @MessageBody() data: any) {
		try {
			if(!data?.message)
				throw new Error('The message is invalid or incorrect');
			if(!client?.user)
				throw new Error('The User is invalid or incorrect');

			const userId = Number(client.user.sub || '0');
			const username = client.user.fio || '';

			const newGroup: INewGroup = {
				roomId: data.message.roomId || 0,
				groupId: data.message.groupId || null,
				nameGroup: data.message.nameGroup || `${username} Group`,
				typeGroup:	data.message.typeGroup || 'private',
				userId,
				users: data.message.users,
				moderators: data.message.moderators,
				active: data.message.active,
				readOnly: data.message.readOnly,
				editMode: data.message.editMode || false,
			}
			if (data.message.editMode) {
				data.message = await this.messendoService.updateGroup(newGroup);
			} else {
				data.message = await this.messendoService.createNewGroup(newGroup);
			}
			this.sendToUser(userId.toString(), 'modifiedGroupProfile', data);
		} catch (err) {
			console.error('createNewGroup Error: ', err)
		}
	}


	//------------------- senders -------------------------------------

	private broadcast(event: string, data: any): void {
		const message: WebSocketMessage = { event, data };
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private sendToUser(userderId: string, event: string, data: any): boolean {
		const client = this.clients.get(userderId);
		if (client) {
			const message: WebSocketMessage = { event, data };
			client.send(JSON.stringify(message));
			return true;
		}
		return false;
	}
}
