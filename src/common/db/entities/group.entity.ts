import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groups')
export class Group {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 64 })
	nameGroup: string;

	@Column({
		default: 'public',
	})
	typeGroup: string;

	@Column()
	userId: number;

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
	moderators: number[];

	@Column({
		default: 1,
	})
	active: number;

	@Column({
		default: 0,
	})
	readOnly: number;

	@Column({
		default: 'now',
	})
	dateCreate: Date;
}
