import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateUserHandler, VerifyEmailHandler } from './commands/handler'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, VerifyEmailHandler, CreateUserHandler],
})
export class UsersModule {
}
