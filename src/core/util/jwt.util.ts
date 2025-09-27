import * as jwt from 'jsonwebtoken';

export class JwtUtil {
  static generateToken(
    payload: any,
    secret: string,
    expiresIn: number,
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn,
      algorithm: 'HS256',
      issuer: 'tamm',
    });
  }

  static verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  static getTokenFromHeader(header: string): string | null {
    if (!header) {
      return null;
    }
    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    return parts[1];
  }
}
