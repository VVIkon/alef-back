import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email', // Правильное место для указания поля
			passwordField: 'password', // Опционально, если нужно переопределить
		});
	}

	async validate(email: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(email, password);
		if (!user) throw new UnauthorizedException();
		return user;
	}
}
