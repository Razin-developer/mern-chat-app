import { Schema, model } from 'mongoose';
const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    image: { type: String, require: false },
    text: { type: String, require: false }
}, { timestamps: true });
const Message = model('Message', messageSchema);
export default Message;
