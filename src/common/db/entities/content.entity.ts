import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contents')
export class Content {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	groupId: number;

	// @Column()
	// groupName?: string;

	@Column()
	userId: number;

	// @Column()
	// userName?: string;

	@Column({
		type: 'text',
		default: '',
	})
	message: string;

	@Column({
		default: 1,
	})
	active: number;

	@Column({
		default: 'now',
	})
	dateCreate: Date;
}
