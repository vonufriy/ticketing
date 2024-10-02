import { Publisher, Subjects, TicketUpdatedEvent } from "@votickets/common/build";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}