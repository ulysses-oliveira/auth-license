import { OAuth2Client } from "google-auth-library";
import config from "../config/config";

export class GoogleOAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(config.google.clientId);
  }

  async verifyToken(credential: string) {
    if (!credential) {
      throw new Error('Token não fornecido');
    }

    const ticket = await this.client.verifyIdToken({
      idToken: credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Payload inválido');
    }
    
    return {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      sub: payload.sub
    };
  }
}