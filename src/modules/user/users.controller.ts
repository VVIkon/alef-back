import {
	Controller,
	Get,
	Res,
	Post,
	UseFilters,
	HttpStatus,
	Param,
	UseGuards,
	// HttpCode,
	NotFoundException,
	// Param,
	Body,
	// Request,
	// Patch,
	Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { AllExceptionsFilter } from '../../common/filters/HttpExceptionFilter';
import { CreateUsersDTO } from '../user/DTO/createUsers.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UserController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	public async getUsers(@Res() res: Response) {
		const users = await this.usersService.getActiveUser();
		if (!users) {
			throw new NotFoundException('Users not found');
		}
		res.status(200).json(users);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get(':id')
	public async getUser(@Res() res: Response, @Param('id') id: number) {
		const user = await this.usersService.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return res.status(HttpStatus.OK).json(user);
	}

	@Post('mail')
	public async getUserByEmail(@Res() res: Response, @Body() mail: { email: string }) {
		const user = await this.usersService.getUserByEmail(mail.email);
		if (!user) {
			throw new Error('Нет такого пользователя!');
		}
		return res.status(HttpStatus.OK).json(user);
	}
	@Post('token')
	public async getUserByToken(
		@Res() res: Response,
		@Body()
		param: {
			id: number;
			token: string;
		},
	) {
		const result = await this.usersService.getUserByToken(param.id, param.token);
		return res.status(result ? HttpStatus.OK : HttpStatus.NOT_FOUND).json({ result });
	}
	@Post()
	public async createUser(@Res() res: Response, @Body() createUsersDTO: CreateUsersDTO) {
		const user = await this.usersService.create(createUsersDTO);
		if (!user) {
			throw new Error('Что-то сломалось!');
		}
		return res.status(HttpStatus.OK).json(user);
	}
	@Post('update')
	public async updateUser(@Res() res: Response, @Body() createUsersDTO: CreateUsersDTO) {
		const user = await this.usersService.updateUserByid(createUsersDTO);
		if (!user) {
			throw new Error('Что-то сломалось!');
		}
		return res.status(HttpStatus.OK).json(user);
	}

	@Delete(':id')
	public async deleteUser(@Res() res: Response, @Param('id') id: number) {
		const deleteResult = await this.usersService.deleteUser(id);
		if (!deleteResult.affected) {
			throw new NotFoundException('Users not found');
		}
		return res.status(HttpStatus.OK).json(deleteResult);
	}
}
