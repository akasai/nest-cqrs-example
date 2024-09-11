import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as uuid from 'uuid'
import { PrismaService } from '../../../../common/prisma/prisma.service'
import { CreateUserCommand } from '../create-user.command'
import { CreateUserHandler } from './create-user.handler'

jest.mock('uuid') // uuid 모듈을 모킹하여 테스트에 고정된 토큰 사용

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback({
              user: {
                create: jest.fn(),
              },
            })),
          },
        },
      ],
    }).compile()

    handler = module.get<CreateUserHandler>(CreateUserHandler)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should throw BadRequestException if user already exists', async () => {
    // Given: 유저가 이미 존재하는 경우
    prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' })

    const command = new CreateUserCommand('test@example.com', 'Test User', '1234')

    // When & Then: 중복된 사용자가 있을 때 BadRequestException이 발생해야 한다
    await expect(handler.execute(command)).rejects.toThrow(BadRequestException)
  })

  it('should create a user if user does not exist', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findUnique = jest.fn().mockResolvedValue(undefined)
    const command = new CreateUserCommand('Test User', 'test@example.com', '1234')

    const mockToken = 'mocked-uuid-token';
    (uuid.v4 as jest.Mock).mockReturnValue(mockToken) // UUID 모킹

    // 트랜잭션 내부에서 호출되는 create 메서드를 모킹
    const createMock = jest.fn()
    prismaService.$transaction = jest.fn().mockImplementation((callback) => {
      return callback({ user: { create: createMock } })
    })


    // When: 새로운 사용자를 생성
    await handler.execute(command)

    // Then: Prisma의 create 메서드가 호출되어야 함
    expect(prismaService.$transaction).toHaveBeenCalled()
    expect(createMock).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: '1234',
        verifyToken: mockToken, // 토큰이 생성된 후 저장되어야 함
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  })
})
