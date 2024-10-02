import { PaymentCreatedEvent, Publisher, Subjects} from "@votickets/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}