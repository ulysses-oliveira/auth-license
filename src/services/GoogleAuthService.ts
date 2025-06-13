import googleClient from '../config/google';
import { GoogleTokenPayload } from '../types';

class GoogleAuthService {
  async verifyGoogleToken(token: string): Promise<GoogleTokenPayload> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Token inválido');
      }

      return {
        sub: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
        email_verified: payload.email_verified || false,
      };
    } catch (error) {
      throw new Error('Token do Google inválido');
    }
  }
}

export default new GoogleAuthService();