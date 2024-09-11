import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './commands/create-user.command'
import { VerifyEmailCommand } from './commands/verify-email.command'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commandBus: CommandBus,
  ) {
  }

  @Post()
  async signUpUser(
    @Body() userData: { name?: string; email: string, password: string },
  ): Promise<any> {
    const { name, email, password } = userData
    return this.commandBus.execute(new CreateUserCommand(name, email, password))
  }


  @Post('/verify-email')
  async verifyEmail(
    @Query('signupVerifyToken') signupVerifyToken: string
  ) {
    return this.commandBus.execute(new VerifyEmailCommand(signupVerifyToken))
  }

  @Get('/:id')
  async getUser(
    @Param('id') id: number,
  ) {
    return this.usersService.getUser({ id: +id })
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') id: number,
  ) {
    return this.usersService.deleteUser({ id: +id })
  }
}
