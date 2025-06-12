import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});

// // Teste rápido
// const testEmail = async () => {
//   try {
//     await transporter.verify();
//     console.log('✅ Configuração SMTP válida');
//   } catch (error) {
//     console.log('❌ Erro na configuração SMTP:', error);
//   }
// };

// testEmail();

export class EmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    if (!email) {
      throw new Error(`Email é obrigatório, emailService.ts ${email}`);
    }

    const verificationLink = `http://localhost:7000/v1/auth/verify?token=${token}`;

    const mailOptions = {
      from: config.email.from || config.email.smtp.auth.user,
      to: email,
      subject: 'Verificação de Email',
      html: `
        <h1>Bem-vindo!</h1>
        <p>Por favor, clique no link abaixo para verificar seu email:</p>
        <a href="${verificationLink}">Verificar Email</a>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email de verificação');
    }
  }
}
