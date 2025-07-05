import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ulid } from 'ulid';
import { Conversations } from './conversation.entity';

export enum ConversationStatus {
  STARTED = 'started',
  ONGOING = 'ongoing',
  FINALIZED = 'finalized',
}

@Entity()
export class Contacts {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  meta_contact_id: string; // phone number

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ConversationStatus, nullable: false })
  status: ConversationStatus;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  update_at: Date;

  @OneToMany(() => Conversations, (conversations) => conversations.contact)
  conversations: Conversations[];

  constructor() {
    this.id = ulid();
  }
}
