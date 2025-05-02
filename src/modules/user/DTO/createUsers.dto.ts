import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDTO {
	@ApiProperty()
	readonly id: number;

	@ApiProperty()
	readonly login: string;

	@ApiProperty()
	readonly password: string;

	@ApiProperty()
	readonly fio: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	token: string;

	@ApiProperty()
	salt: number;

	@ApiProperty()
	token_expare: number;

	@ApiProperty()
	permition_id: number;

	@ApiProperty()
	active: number;
}
