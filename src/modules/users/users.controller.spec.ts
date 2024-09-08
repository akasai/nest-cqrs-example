import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(), // UsersService의 createUser 메서드를 모킹
            getUser: jest.fn(), // UsersService의 createUser 메서드를 모킹
          },
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call usersService.createUser when signUpUser is called', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' }
    const createdUser = { id: 1, ...userData };

    (usersService.createUser as jest.Mock).mockResolvedValue(createdUser)

    const result = await controller.signUpUser(userData)

    expect(usersService.createUser).toHaveBeenCalledWith(userData)
    expect(result).toEqual(createdUser)
  })

  it('should call usersService.getUser when getUser is called', async () => {
    const data = 1
    const userData = { id: 1, name: 'Test User', email: 'test@example.com' };


    (usersService.getUser as jest.Mock).mockResolvedValue(userData)

    const result = await controller.getUser(data)

    expect(usersService.getUser).toHaveBeenCalledWith({ id: data })
    expect(result).toEqual(userData)
  })
})
