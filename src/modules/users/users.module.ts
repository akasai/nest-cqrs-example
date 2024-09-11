import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateUserHandler, LoginHandler, VerifyEmailHandler } from './commands/handler'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, VerifyEmailHandler, CreateUserHandler, LoginHandler],
})
export class UsersModule {
}
