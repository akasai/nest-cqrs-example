import { BadRequestException, Injectable } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import * as uuid from 'uuid'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { TestEvent } from '../events/test.events'
import { UserCreateEvent } from '../events/user-create.events'
import { CreateUserCommand } from '../commands/create-user.command'

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBus,
  ) {
  }

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command
    if (await this.checkUserExists(command.email)) {
      throw new BadRequestException('User already exists.')
    }
    const verifyToken = uuid.v4()

    await this.prisma.$transaction(async (prisma) => {
      return prisma.user.create({
        select: { id: true, name: true, email: true },
        data: { name, email, password, verifyToken },
      })
    })
    this.eventBus.publish(new UserCreateEvent(email, verifyToken))
    this.eventBus.publish(new TestEvent())
  }

  private async checkUserExists(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    console.log('### user', user)
    return !!user
  }
}
