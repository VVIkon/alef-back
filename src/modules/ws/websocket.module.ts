import { WebSocketGateWay } from './websocket.gateway';
import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
// import { UsersService } from '../user/users.service';
// import { UserRepository } from '../user/user.repository';
import { MessendoModule } from '../messendo/messendo.module';
// import { MessendoService } from '../messendo/messendo.service';

@Module({
	imports: [
		AuthModule,
		forwardRef(() => UsersModule),
		forwardRef(() => MessendoModule),
	],
	providers: [
		WebSocketGateWay,
		// UsersService,
		// MessendoService,
		// UserRepository,
	],
	exports: [WebSocketGateWay],
	// exports: [WebSocketGateWay, UsersService, MessendoService, UserRepository],
})
export class WebSocketModule {}

// @Module({
// 	imports: [
// 		// UsersService,
// 		// MessendoService,
// 		JwtModule.register({
// 			secret: process.env.JWT_SECRET_KEY,
// 			signOptions: { expiresIn: '1h' },
// 		}),
// 	],
// 	providers: [WebSocketGateWay],
// 	exports: [WebSocketGateWay],
// 	// exports: [WebSocketGateWay, UsersService, MessendoService],
// })
// export class WSModule {}
