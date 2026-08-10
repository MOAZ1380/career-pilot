/**
 * JWT Payload interface for access tokens
 * Contains minimal necessary information for authorization
 */
export interface JwtAccessPayload {
  sub: string; // user ID (subject)
  email: string;
  type: 'access';
  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * JWT Payload interface for refresh tokens
 * Minimal payload for security
 */
export interface JwtRefreshPayload {
  sub: string; // user ID (subject)
  type: 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * JWT Payload interface for reset tokens
 * Short-lived, single-use token for password reset
 */
export interface JwtResetPayload {
  sub: string; // user ID (subject)
  email: string;
  type: 'reset';
  iat?: number;
  exp?: number;
}

/**
 * Union type for all JWT payloads
 */
export type JwtPayload = JwtAccessPayload | JwtRefreshPayload | JwtResetPayload;
