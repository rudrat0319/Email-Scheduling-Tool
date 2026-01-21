import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EmailBatch } from './emailBatchEntity';
import { JobStatus } from '../config/constants';

@Entity('email_jobs')
@Index(['userId', 'status'])
@Index(['status', 'scheduledAt'])
export class EmailJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  batchId: string;

  @Column()
  userId: string;

  @Column()
  recipientEmail: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.SCHEDULED,
  })
  status: JobStatus;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => EmailBatch, batch => batch.jobs)
  @JoinColumn({ name: 'batchId' })
  batch: EmailBatch;
}