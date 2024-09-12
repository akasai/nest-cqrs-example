import { BadRequestException, Injectable } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { VerifyEmailCommand } from '../commands/verify-email.command'

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(private prisma: PrismaService) {
  }

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command
    const user = await this.prisma.user.findFirst({ where: { verifyToken: signupVerifyToken } })
    if (!user) {
      throw new BadRequestException('User does not exist.')
    }

    // TODO: authservice. login
    return true
  }
}
