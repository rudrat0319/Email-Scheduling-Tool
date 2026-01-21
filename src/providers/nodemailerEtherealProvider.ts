import nodemailer from 'nodemailer';
import { SmtpEmailProvider, EmailData } from './smtpEmailProvider';

export class NodemailerEtherealProvider implements SmtpEmailProvider {
  async send(data: EmailData): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: data.smtpConfig.host,
      port: data.smtpConfig.port,
      secure: false,
      auth: {
        user: data.smtpConfig.user,
        pass: data.smtpConfig.password,
      },
    });

    await transporter.sendMail({
      from: `"${data.from.name}" <${data.from.email}>`,
      to: data.to,
      subject: data.subject,
      text: data.body,
    });
  }
}