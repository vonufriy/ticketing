import {Subjects, Publisher, ExpirationCompleteEvent} from  '@votickets/common/build';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

    constructor(client: any) {
        super(client);
    }

    publish(data: ExpirationCompleteEvent['data']): Promise<void> {
        return super.publish(data);
    }
}