import { Request } from 'express';
import { JwtPayload } from './payloads';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface JwtRequest extends Request {
  user: JwtPayload;
}
