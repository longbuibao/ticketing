import mongoose from 'mongoose';

import app from './app';
import { natsWrapper } from './nats-wrapper';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');
  try {
    await natsWrapper.connect('ticketing', 'asdf', 'http://nats-clusterip-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS existed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
