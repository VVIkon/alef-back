import {
	Controller,
	Get,
	Res,
	Post,
	// UseFilters,
	UseGuards,
	HttpStatus,
	// Param,
	// HttpCode,
	// NotFoundException,
	// Param,
	// Body,
	Request,
	// Patch,
	// Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	getProfile(@Request() req, @Res() res: Response) {
		return res.status(HttpStatus.OK).json(req.user);
	}
}
