import Bull from 'bull';

import { ExpirationCompletePublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Bull<Payload>('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
});

// send from redis
expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});

export { expirationQueue };
