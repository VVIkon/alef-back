import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 64 })
	login: string;

	@Column({ length: 64 })
	password: string;

	@Column({ length: 128 })
	fio: string;

	@Column({ length: 128 })
	email: string;

	@Column({ length: 512 })
	token: string;

	@Column()
	salt: number;

	@Column()
	token_expare: number;

	@Column()
	permition_id: number;

	@Column()
	active: number;
}
