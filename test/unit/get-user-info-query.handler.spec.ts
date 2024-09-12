import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../src/common/prisma/prisma.service'
import { GetUserInfoQueryHandler } from '../../src/modules/users/handler/get-user-info-query.handler'
import { GetUserInfoQuery } from '../../src/modules/users/queries/get-user-info.query'

jest.mock('uuid') // uuid 모듈을 모킹하여 테스트에 고정된 토큰 사용

describe('CreateUserHandler', () => {
  let handler: GetUserInfoQueryHandler
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserInfoQueryHandler,
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

    handler = module.get<GetUserInfoQueryHandler>(GetUserInfoQueryHandler)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should throw BadRequestException if user does not exists', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findUnique = jest.fn().mockResolvedValue(null)

    const command = new GetUserInfoQuery(1)

    // When & Then: 중복된 사용자가 있을 때 BadRequestException이 발생해야 한다
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
  })

  it('should get a user if user does exist', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findUnique = jest.fn().mockResolvedValue({ name: 'test', email: 'test@example.com' })
    const command = new GetUserInfoQuery(1)

    // When: 새로운 사용자를 생성
    await handler.execute(command)

    // Then: Prisma의 create 메서드가 호출되어야 함
    expect(prismaService.user.findUnique).toHaveBeenCalled()
  })
})
