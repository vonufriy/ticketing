import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent } from '@votickets/common/build';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Create a fake data event
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    });
    ticket.set({ orderId });
    await ticket.save();

    // Create a fake message object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, orderId,  data, msg };
}

it('updates the ticket, publishes an event, and acks the message ', async () => {
    const { listener, ticket, orderId, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});