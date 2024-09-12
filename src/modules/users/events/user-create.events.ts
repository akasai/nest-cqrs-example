import { IEvent } from '@nestjs/cqrs'
import { CqrsEvent } from '../../../common/events/cqrs.events'

export class UserCreateEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly signupVerifyToken: string,
  ) {
    super(UserCreateEvent.name)
  }
}
