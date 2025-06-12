import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { generateToken } from '../utils/jwt';
import { User, License, JwtPayload } from '../types/auth';

export class AuthService {
  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    // Verificar se usuário já existe
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('Usuário já existe');
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    const user = result.rows[0];

    // Criar licença inicial (inativa por padrão)
    const licenseResult = await pool.query(
      'INSERT INTO license (user_id, status, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [user.id, 'inactive', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] // 30 dias
    );

    const license = licenseResult.rows[0];

    // Gerar token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      licenseId: license.id,
      licenseStatus: license.status
    };

    const token = generateToken(payload);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; license: License; token: string }> {
    // Buscar usuário
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      throw new Error('Credenciais inválidas');
    }

    const user = userResult.rows[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Buscar licença ativa do usuário
    const licenseResult = await pool.query(
      'SELECT * FROM license WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    let license = licenseResult.rows[0];

    // Verificar se a licença expirou
    if (license && new Date() > new Date(license.expires_at)) {
      await pool.query(
        'UPDATE license SET status = $1 WHERE id = $2',
        ['expired', license.id]
      );
      license.status = 'expired';
    }

    // Gerar token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      licenseId: license?.id,
      licenseStatus: license?.status
    };

    const token = generateToken(payload);

    return { user, license, token };
  }

  async refreshToken(userId: string): Promise<string> {
    // Buscar usuário e licença atualizados
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    const user = userResult.rows[0];

    const licenseResult = await pool.query(
      'SELECT * FROM license WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const license = licenseResult.rows[0];

    // Verificar se a licença expirou
    if (license && new Date() > new Date(license.expires_at)) {
      await pool.query(
        'UPDATE license SET status = $1 WHERE id = $2',
        ['expired', license.id]
      );
      license.status = 'expired';
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      licenseId: license?.id,
      licenseStatus: license?.status
    };

    return generateToken(payload);
  }

  async activateLicense(userId: string): Promise<License> {
    const result = await pool.query(
      'UPDATE license SET status = $1 WHERE user_id = $2 AND status = $3 RETURNING *',
      ['active', userId, 'inactive']
    );

    if (result.rows.length === 0) {
      throw new Error('Licença não encontrada ou já ativa');
    }

    return result.rows[0];
  }
}
