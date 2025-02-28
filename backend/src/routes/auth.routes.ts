import { Router } from 'express';
import { signup, login, logout, handleDelete, checkLoggedIn, handleUpdate, handleUserForgot, handleUserForgotSuccess, handleUserReset } from '../controllers/auth.controller.js';
import upload from '../middlewares/update-profile-image.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout',authorize, logout);

router.post('/delete',authorize, handleDelete);

router.post('/forgot', handleUserForgot);

router.post('/forgot/success', handleUserForgotSuccess);

router.post('/reset', handleUserReset);

router.get('/check',authorize, checkLoggedIn);

router.put('/update-profile',authorize, upload.single("profilePic"), handleUpdate);

export default router;