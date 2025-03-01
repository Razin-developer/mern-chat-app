import { Router } from 'express';
import { signup, login, logout, handleDelete, checkLoggedIn, handleUpdate, handleUserForgot, handleUserForgotSuccess, handleUserReset, handleUserGoogleLogin } from '../controllers/auth.controller.js';
import authorize from '../middlewares/authorize.middleware.js';
import passport from 'passport';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout',authorize, logout);

router.post('/delete',authorize, handleDelete);

router.post('/forgot', handleUserForgot);

router.post('/forgot/success', handleUserForgotSuccess);

router.post('/reset', handleUserReset);

router.get('/check',authorize, checkLoggedIn);

router.put('/update-profile',authorize, handleUpdate);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  handleUserGoogleLogin(req, res);
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

export default router;