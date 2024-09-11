import { Injectable, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../../common/prisma/prisma.service'
import { LoginCommand } from '../login.command'
// import { AuthService } from 'src/auth/auth.service'

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private prisma: PrismaService) {
  }

  async execute(command: LoginCommand): Promise<any> {
    const { email, password } = command
    const user = await this.prisma.user.findUnique({
      where: { email, password },
    })

    if (!user) {
      throw new NotFoundException('User does not exist.')
    }

    // TODO: login
    // return this.authService.login({
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    // })
    return true
  }
}
