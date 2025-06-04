import { WebSocket } from 'ws';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

export interface AuthenticatedWebSocket extends WebSocket {
	send(arg0: string): unknown;
	user?: JwtPayload;
}
