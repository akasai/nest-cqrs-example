import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateUserHandler } from './commands/handler/create-user.handler'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, CreateUserHandler],
})
export class UsersModule {
}
