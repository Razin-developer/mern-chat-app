import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'jwtSecret';


interface DecodedToken extends JwtPayload {
  userId: string;
}

export function setJwt(userId: string): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
}

export function getUser(jwtToken: string): { userId: string } {
  return jwt.verify(jwtToken, jwtSecret) as DecodedToken;
}
