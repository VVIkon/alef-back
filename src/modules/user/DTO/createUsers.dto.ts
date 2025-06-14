import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDTO {
	@ApiProperty()
	id: number;

	@ApiProperty()
	login: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	fio: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	token: string;

	@ApiProperty()
	salt: number;

	@ApiProperty()
	token_expare: number;

	@ApiProperty()
	roles: string[];

	@ApiProperty()
	active: number;
}
