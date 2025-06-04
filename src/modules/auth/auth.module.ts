import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebSocketGateWay } from '../ws/websocket.gateway';

@Module({
	imports: [
		forwardRef(() => UsersModule),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET_KEY'),
				signOptions: {
					// algorithm: 'RS256',
					expiresIn: `${configService.get<number>('JWT_EXPIRATION_TIME') || 1}d`,
				},
				// verifyOptions: {
				// 	algorithms: ['RS256'],
				// },
			}),
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, WebSocketGateWay],
	controllers: [AuthController],
	exports: [AuthService, WebSocketGateWay],
})
export class AuthModule {}
