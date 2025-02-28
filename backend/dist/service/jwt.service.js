import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || 'jwtSecret';
export function setJwt(userId) {
    return jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
}
export function getUser(jwtToken) {
    return jwt.verify(jwtToken, jwtSecret);
}
