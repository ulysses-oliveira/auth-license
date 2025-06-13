import nodemailer from 'nodemailer';
import config from '../config/config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: Number(config.email.smtp.port || '587'),
      secure: Boolean(config.email.smtp.secure),
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });
  }

  async sendVerificationEmail(email: string, code: string, name: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Código de Verificação - 2FA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá ${name}!</h2>
          <p>Seu código de verificação é:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>Este código expira em 10 minutos.</p>
          <p>Se você não solicitou este código, ignore este email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();