import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './commands/create-user.command'
import { LoginCommand } from './commands/login.command'
import { VerifyEmailCommand } from './commands/verify-email.command'
import { GetUserInfoQuery } from './queries/get-user-info.query'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
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
    @Query('signupVerifyToken') signupVerifyToken: string,
  ) {
    return this.commandBus.execute(new VerifyEmailCommand(signupVerifyToken))
  }

  @Post('/login')
  async login(
    @Body() userData: { email: string; password: string },
  ) {
    const { email, password } = userData
    return this.commandBus.execute(new LoginCommand(email, password))
  }

  @Get('/:id')
  async getUser(
    @Param('id') id: number,
  ) {
    return this.queryBus.execute(new GetUserInfoQuery(id));
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') id: number,
  ) {
    return this.usersService.deleteUser({ id: +id })
  }
}
