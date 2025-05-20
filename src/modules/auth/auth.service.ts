import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { UtilsService } from '../../common/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/common/db/entities/users.entity';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(name: string, pass: string): Promise<any> {
		let user: User | null = null;
		if (UtilsService.isEmail(name)) {
			user = await this.usersService.getUserByEmail(name);
		} else {
			user = await this.usersService.getUserByEmail(name);
		}
		if (user && (await bcrypt.compare(pass, user?.password))) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}
		return null;
	}
	// Это то что будет завёрнуто в токен
	login(user: any) {
		try {
			const payload = {
				sub: user.id,
				email: user.email,
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
