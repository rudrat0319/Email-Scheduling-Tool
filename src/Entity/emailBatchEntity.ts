import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Sender } from './senderEntity';
import { EmailJob } from './emailJobEntity';

@Entity('email_batches')
export class EmailBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  senderId: string;

  @Column()
  subject: string;

  @Column('text')
  body: string;

  @Column()
  totalRecipients: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column()
  delaySeconds: number;

  @Column()
  hourlyLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Sender, sender => sender.batches)
  @JoinColumn({ name: 'senderId' })
  sender: Sender;

  @OneToMany(() => EmailJob, job => job.batch)
  jobs: EmailJob[];
}