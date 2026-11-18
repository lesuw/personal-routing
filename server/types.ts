export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

export interface UserRow extends PublicUser {
  pass_hash: string;
  created_at: string;
}

export interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: number;
}

export interface RouteRow {
  id: number;
  user_id: number;
  title: string;
  time: string;
  km: number;
  tag: string;
  fav: number;
}

export interface AuthTokenPayload {
  sub: number;
  email?: string;
  jti?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}
