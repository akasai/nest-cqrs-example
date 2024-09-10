import { CommandBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserCommand } from './commands/create-user.command'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService
  let commandBus: CommandBus

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
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
    commandBus = module.get<CommandBus>(CommandBus)
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

  it('should call usersService.getUser when getUser is called', async () => {
    const data = 1
    const userData = { id: 1, name: 'Test User', email: 'test@example.com', password: '1224' };

    (usersService.getUser as jest.Mock).mockResolvedValue(userData)

    const result = await controller.getUser(data)

    expect(usersService.getUser).toHaveBeenCalledWith({ id: data })
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
