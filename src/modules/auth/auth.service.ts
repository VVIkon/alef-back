import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, pass: string): Promise<any> {
		const user = await this.usersService.getUserByEmail(email);
		if (user && (await bcrypt.compare(pass, user.password))) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	login(user: any) {
		try {
			const payload = {
				email: user.email,
				sub: user.id,
				roles: user.roles,
				active: user.active,
				fio: user.fio,
			};
			const access_token = this.jwtService.sign(payload);
			return { access_token };
		} catch (error) {
			console.log(error.message);
		}
	}
}
