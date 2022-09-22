import { Publisher, PaymentCreatedEvent, Subjects } from '@lbbticket/common';

export class PaymentCreatedPubliser extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
