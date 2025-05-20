import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'name', // Правильное место для указания поля
			passwordField: 'pass', // Опционально, если нужно переопределить
		});
	}

	async validate(name: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(name, password);
		if (!user) throw new UnauthorizedException();
		return user;
	}
}
