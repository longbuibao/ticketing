import mongoose from 'mongoose';
import app from './app';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');
  try {
    console.log('Connecting to mongodb...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Mongodb');
  } catch (error) {
    console.error(error);
  }
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
