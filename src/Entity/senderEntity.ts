import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { user } from './userEntity';
import { EmailBatch } from './emailBatchEntity';

@Entity('senders')
export class Sender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  smtpHost?: string;

  @Column({ nullable: true })
  smtpPort?: number;

  @Column({ nullable: true })
  smtpUser?: string;

  @Column({ nullable: true })
  smtpPassword?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => user, user => user.senders)
  @JoinColumn({ name: 'userId' })
  user: user;

  @OneToMany(() => EmailBatch, batch => batch.sender)
  batches: EmailBatch[];
}