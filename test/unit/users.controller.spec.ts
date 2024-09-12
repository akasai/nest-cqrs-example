import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import * as uuid from 'uuid'
import { CreateUserCommand } from '../../src/modules/users/commands/create-user.command'
import { LoginCommand } from '../../src/modules/users/commands/login.command'
import { VerifyEmailCommand } from '../../src/modules/users/commands/verify-email.command'
import { GetUserInfoQuery } from '../../src/modules/users/queries/get-user-info.query'
import { UsersController } from '../../src/modules/users/users.controller'
import { UsersService } from '../../src/modules/users/users.service'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService
  let commandBus: CommandBus
  let queryBus: QueryBus

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(), // UsersService의 createUser 메서드를 모킹
            getUser: jest.fn(), // UsersService의 getUser 메서드를 모킹
            deleteUser: jest.fn(), // UsersService의 deleteUser 메서드를 모킹
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(), // CommandBus의 execute 메서드 모킹
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(), // CommandBus의 execute 메서드 모킹
          },
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
    commandBus = module.get<CommandBus>(CommandBus)
    queryBus = module.get<QueryBus>(QueryBus)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call commandBus.execute when signUpUser is called', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: '1224' }
    const createdUser = { id: 1, ...userData };

    (commandBus.execute as jest.Mock).mockResolvedValue(createdUser)

    const result = await controller.signUpUser(userData)

    expect(commandBus.execute).toHaveBeenCalledWith(
      new CreateUserCommand(userData.name, userData.email, userData.password),
    )
    expect(result).toEqual(createdUser)
  })

  it('should call commandBus.execute when verifyEmail is called', async () => {
    const token = uuid.v4();

    (commandBus.execute as jest.Mock).mockResolvedValue(true)

    const result = await controller.verifyEmail(token)
    expect(commandBus.execute).toHaveBeenCalledWith(
      new VerifyEmailCommand(token)
    )
    expect(result).toEqual(true)
  })

  it('should call commandBus.execute when login is called', async () => {
    const userData = { email: 'test@example.com', password: '1234' };
    (commandBus.execute as jest.Mock).mockResolvedValue(true)

    const result = await controller.login(userData)
    expect(commandBus.execute).toHaveBeenCalledWith(
      new LoginCommand(userData.email, userData.password)
    )
    expect(result).toEqual(true)
  })

  it('should call usersService.getUser when getUser is called', async () => {
    const data = 1
    const userData = { id: 1, name: 'Test User', email: 'test@example.com' };

    (queryBus.execute as jest.Mock).mockResolvedValue(userData)

    const result = await controller.getUser(data)

    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetUserInfoQuery(data)
    )
    expect(result).toEqual(userData)
  })

  it('should call usersService.deleteUser when deleteUser is called', async () => {
    const data = 1
    const userData = { id: 1, name: 'Test User', email: 'test@example.com', password: '1224' };

    (usersService.deleteUser as jest.Mock).mockResolvedValue(userData)

    const result = await controller.deleteUser(data)

    expect(usersService.deleteUser).toHaveBeenCalledWith({ id: data })
    expect(result).toEqual(userData)
  })
})
