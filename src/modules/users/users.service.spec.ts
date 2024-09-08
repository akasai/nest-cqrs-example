import { Test, TestingModule } from '@nestjs/testing'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(), // PrismaService의 user.create 메서드를 모킹
            },
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create user', () => {
    it('should create a new user', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
      }
      const expectedUser = {
        id: 1,
        email: userData.email,
        name: userData.name,
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(expectedUser)

      const result = await service.createUser(userData)
      expect(result).toEqual(expectedUser)

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: userData,
      })
    })
  })
})
