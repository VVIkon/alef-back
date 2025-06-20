import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(
		private authService: AuthService,
		private jwtService: JwtService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient();
		const ws = context.switchToWs();
		const data = ws.getData();
		const token = String(data?.token) || '';

		if (!token) {
			throw new WsException('Unauthorized');
		}

		try {
			const payload = await this.jwtService.decode(token);
			client.user = payload;
			return !!payload;
		} catch (err) {
			console.log('verifyToken Error: ', err);
			throw new WsException('Unauthorized');
		}
	}
}
