import { Body, Controller, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }
  @Post()
  async signUpUser(@Body() userData: { name?: string; email: string }): Promise<any> {
    return this.usersService.createUser(userData)
  }
}
