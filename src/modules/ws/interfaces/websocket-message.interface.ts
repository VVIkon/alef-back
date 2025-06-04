export interface WebSocketMessage<T = any> {
	event: string;
	data: T;
}
