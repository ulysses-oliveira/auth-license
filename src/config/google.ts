import { OAuth2Client } from 'google-auth-library';
import config from './config';

const googleClient = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
);

export default googleClient;