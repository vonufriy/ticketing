import { Publisher, OrderCreatedEvent, Subjects } from '@votickets/common/build';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}