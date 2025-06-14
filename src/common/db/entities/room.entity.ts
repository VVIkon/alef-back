import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 64 })
	name: string;

	@Column()
	userId: number;

	@Column({
		type: 'integer',
		array: true,
		default: '{}',
	})
	groups: number[];

	@Column({
		type: 'integer',
		array: true,
		default: '{}',
	})
	users: number[];

	@Column({
		type: 'integer',
		array: true,
		default: '{}',
	})
	channels: number[];

	@Column({
		default: 1,
	})
	active: number;

	@Column({
		default: 'now',
	})
	dateCreate: Date;
}
