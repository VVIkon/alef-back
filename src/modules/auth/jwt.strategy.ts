import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		const secretOrKey = configService.get<string>('JWT_SECRET_KEY') || '';
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey,
		});
	}

	validate(payload: any) {
		return {
			userId: payload.sub,
			email: payload.email,
			roles: payload.roles,
			active: payload.active,
			fio: payload.fio,
		};
	}
}
