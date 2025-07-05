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
import { Contact } from './contact.entity';
import { Message } from './message.entity';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  BROADCAST = 'broadcast',
}
  

@Entity()
export class Conversation {
  @PrimaryColumn({ type: 'varchar', length: 26 }) // ULIDs
  id: string;

  @Column({ type: 'enum', enum: ConversationType, nullable: false })
  type: ConversationType;

  @ManyToOne(() => Contact, (contact) => contact.conversations)
  @JoinColumn({ name: 'contact_id', referencedColumnName: 'id' })
  contact: Contact;

  @Column({ type: 'varchar', length: 60, nullable: true })
  subject: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  update_at: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  constructor() {
    this.id = ulid();
  }
}
