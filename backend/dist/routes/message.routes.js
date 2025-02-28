import { Router } from 'express';
import { getUsers, getMessages, sendMessages } from '../controllers/message.controller.js';
import authorize from '../middlewares/authorize.middleware.js';
import upload from '../middlewares/image-send.middleware.js';
const router = Router();
router.get('/users', authorize, getUsers);
router.post('/send/:receiverId', authorize, upload.single("messageImage"), sendMessages);
router.get('/:id', authorize, getMessages);
export default router;
