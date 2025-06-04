import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ws = context.switchToWs();
		const client = context.switchToWs().getClient();
		const data = ws.getData();
		const token = data?.token || '';

		if (!token) {
			throw new WsException('Unauthorized');
		}

		try {
			const payload = await this.authService.verifyToken(token);
			client.user = payload;
			return !!payload;
		} catch (err) {
			throw new WsException('Unauthorized');
		}
	}

	// private extractToken(client: any): string | null {
	// 	const open = client.handshake;
	// 	console.log(open);
	// 	if (client.handshake?.headers?.authorization) {
	// 		const [type, token] =
	// 			client.handshake.headers.authorization.split(' ');
	// 		return type === 'Bearer' ? token : null;
	// 	}
	// 	return null;
	// }
}
