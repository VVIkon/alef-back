export interface JwtPayload {
	sub: string; // user ID
	email: string;
	roles: string[];
	active: number;
	fio: string;
}
