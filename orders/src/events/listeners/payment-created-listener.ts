import {Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@votickets/common/build";
import { Message } from 'node-nats-streaming';
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = 'payments-service';

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById({
            _id: data.orderId
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });

        await order.save();

        msg.ack();
    }
}