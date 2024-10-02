import { OrderCreatedEvent, OrderStatus } from '@votickets/common/build';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';


const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create a fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'fake-expires-at',
        status: OrderStatus.Created,
        ticket: {
            id: 'fake-ticket-id',
            price: 10
        }
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure an order was created!
    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
        const { listener, data, msg } = await setup();

        // Call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // Write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled
});