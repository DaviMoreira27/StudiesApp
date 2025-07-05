import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Contacts } from './contact.entity';
import { Messages } from './message.entity';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  BROADCAST = 'broadcast',
}
  

@Entity()
export class Conversations {
  @PrimaryColumn({ type: 'varchar', length: 26 }) // ULIDs
  id: string;

  @Column({ type: 'enum', enum: ConversationType, nullable: false })
  type: ConversationType;

  @ManyToOne(() => Contacts, (contacts) => contacts.conversations)
  @JoinColumn({ name: 'contact_id', referencedColumnName: 'id' })
  contact: Contacts;

  @Column({ type: 'varchar', length: 60, nullable: true })
  subject: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  update_at: Date;

  @OneToMany(() => Messages, (messages) => messages.conversation)
  messages: Messages[];

  constructor() {
    this.id = ulid();
  }
}
