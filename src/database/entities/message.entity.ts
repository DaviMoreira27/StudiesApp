import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Conversations } from './conversation.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  STICKER = 'sticker',
  DOCUMENT = 'document',
  UNSUPPORTED = 'unsupported',
}

@Entity()
export class Messages {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @ManyToOne(() => Conversations, (conversations) => conversations.messages)
  @JoinColumn({ name: 'conversation_id', referencedColumnName: 'id' })
  conversation: Conversations;

  @Column({ type: 'enum', enum: MessageType, nullable: false })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  meta_message_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  meta_media_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  media_url: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  update_at: Date;

  constructor() {
    this.id = ulid();
  }
}
