import { Router } from 'express';
import { getUsers, getMessages, sendMessages } from '../controllers/message.controller.js';
import authorize from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/users', authorize ,getUsers)

router.post('/send/:receiverId',authorize,  sendMessages)

router.get('/:id',authorize, getMessages)

export default router;