import { Publisher, Subjects, TicketCreatedEvent } from "@votickets/common/build";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}