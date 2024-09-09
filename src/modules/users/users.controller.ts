import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  async signUpUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<any> {
    return this.usersService.createUser(userData)
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
