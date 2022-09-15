import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  // console.log('Publisher connected to nats');
  // const data = JSON.stringify({
  //   title: 'fddfdfdfdf',
  //   price: 23333,
  // });
  // stan.publish('ticket:created', data);
  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: 'dlfjdlkf',
    price: 1,
    title: 'ldfdfk',
  });
});
