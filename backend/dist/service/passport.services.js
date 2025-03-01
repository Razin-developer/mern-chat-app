import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (clientID !== undefined && clientSecret) {
    passport.use(new GoogleStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile'],
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }));
}
else {
    console.error('Google client ID or secret is missing');
}
passport.serializeUser((users, done) => {
    done(null, users);
});
passport.deserializeUser((users, done) => {
    done(null, users);
});
export default passport;
