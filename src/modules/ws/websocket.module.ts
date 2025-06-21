import { WebSocketGateWay } from './websocket.gateway';
import { Module, forwardRef } from '@nestjs/common';
import { MessendoModule } from '../messendo/messendo.module';

@Module({
	imports: [
		MessendoModule
		// forwardRef(() => MessendoModule)
	],
	providers: [WebSocketGateWay],
	// exports: [WebSocketGateWay],
})
export class WebSocketModule {}
