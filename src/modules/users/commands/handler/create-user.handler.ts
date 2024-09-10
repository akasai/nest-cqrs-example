import { BadRequestException, Injectable } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import * as uuid from 'uuid'
import { PrismaService } from '../../../../common/prisma/prisma.service'
import { CreateUserCommand } from '../create-user.command'

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private prisma: PrismaService) {
  }

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command
    if (await this.checkUserExists(command.email)) {
      throw new BadRequestException('User already exists.')
    }
    const verifyToken = uuid.v4()

    return this.prisma.$transaction(async (prisma) => {
      return prisma.user.create({
        select: { id: true, name: true, email: true },
        data: { name, email, password, verifyToken },
      })
    })
  }

  private async checkUserExists(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user !== undefined
  }
}
