import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string; // Optional, if your JWT payload
  // Thêm các field khác nếu payload JWT của bạn có
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface JwtRequest extends Request {
  user: JwtPayload;
}

export interface ProfileOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ProfileOrder {
  id: number;
  restaurant: string;
  status: string;
  createdAt: Date;
  items: ProfileOrderItem[];
}

export interface UserProfile {
  id: number;
  name?: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string; // userId
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
