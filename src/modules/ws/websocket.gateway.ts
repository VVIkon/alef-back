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
import { Server, WebSocket } from 'ws';
// import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedWebSocket } from './interfaces/authenticated-websocket.interface';
import { WebSocketMessage } from './interfaces/websocket-message.interface';
import { WsJwtGuard } from '../auth/ws-jwt.guard';

@WebSocketGateway(8080, {
	path: '/ws',
	cors: {
		origin: '*',
	},

	transports: ['websocket'],
})
export class WebSocketGateWay
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('WebSocketGateway');
	private clients: Map<string, AuthenticatedWebSocket> = new Map();

	handleConnection() {
	// handleConnection(client: AuthenticatedWebSocket) {
		this.logger.log(`client connected`);
	}
	handleDisconnect(client: AuthenticatedWebSocket) {
		if (client.user) {
			this.clients.delete(client.user.sub);
			this.logger.log(`Client disconnected: ${client.user.fio}`);
			this.broadcast('userDisconnected', { userId: client.user.sub });
		}
	}

	// @UseGuards(AuthGuard('jwt'))
	@UseGuards(WsJwtGuard)
	@SubscribeMessage('authenticate')
	handleAuth(@ConnectedSocket() client: AuthenticatedWebSocket) {
		let data = {};
		if (client?.user?.sub) {
			const user = client.user;
			this.clients.set(user.sub || '', client);
			this.logger.log(`Client authenticated: ${user.fio || ''}`);
			data = { success: true, user };
		}
		return { event: 'authenticated', data };
	}

	// @UseGuards(AuthGuard('jwt'))
	@UseGuards(WsJwtGuard)
	@SubscribeMessage('sendMessage')
	handleMessage(
		@ConnectedSocket() client: AuthenticatedWebSocket,
		@MessageBody() data: any,
	) {
		// console.log('>>> data: ', data);
		this.broadcast('newMessage', {
			userId: client?.user?.sub || '',
			username: client?.user?.fio || '',
			message: data.message,
		});
	}

	private broadcast(event: string, data: any): void {
		const message: WebSocketMessage = { event, data };
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	sendToUser(userId: string, event: string, data: any): boolean {
		const client = this.clients.get(userId);
		// if (client && client.readyState && client.readyState === WebSocket.OPEN) {
		if (client) {
			const message: WebSocketMessage = { event, data };
			client.send(JSON.stringify(message));
			return true;
		}
		return false;
	}
}
