import { IEvent } from '@nestjs/cqrs'
import { CqrsEvent } from '../../../common/events/cqrs.events'

export class TestEvent extends CqrsEvent implements IEvent {
  constructor() {
    super(TestEvent.name)
  }
}
