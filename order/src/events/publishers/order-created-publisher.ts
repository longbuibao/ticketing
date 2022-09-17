import { Publisher, OrderCreatedEvent, Subjects } from '@lbbticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
