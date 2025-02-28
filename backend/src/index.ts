import 'dotenv/config'; // Import environment variables

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Importing routes
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import { server } from './socket/socket.js';

// Initializing port
const port = process.env.PORT || 8000;

// Setting up the express app
import { app } from './socket/socket.js';
import path from 'path';

// Connecting to the database
const mongoUri = process.env.MONGODB_URI;
const __dirname = path.resolve()
const htmlPath = path.join(__dirname, '/frontend/dist/index.html');
const staticPath = path.join(__dirname, '/frontend/dist');
console.log(htmlPath);
console.log(__dirname);
console.log(staticPath);

if (!mongoUri) {
    throw new Error('MongoURI is missing');
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log('Error connecting to the database: ', err);
    process.exit();
  });

// Setting up the server with middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // Important if using cookies or sessions
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// App routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes); 



console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(staticPath)))
  app.get("*", (req, res) => {
    res.sendFile(path.join(htmlPath));
  });
}

export default app

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
