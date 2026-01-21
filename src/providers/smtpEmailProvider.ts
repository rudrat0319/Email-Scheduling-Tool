export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface EmailData {
  from: { name: string; email: string };
  to: string;
  subject: string;
  body: string;
  smtpConfig: SmtpConfig;
}

export interface SmtpEmailProvider {
  send(data: EmailData): Promise<void>;
}