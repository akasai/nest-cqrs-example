import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as uuid from 'uuid'
import { PrismaService } from '../../src/common/prisma/prisma.service'
import { CreateUserCommand } from '../../src/modules/users/commands/create-user.command'
import { VerifyEmailCommand } from '../../src/modules/users/commands/verify-email.command'
import { VerifyEmailHandler } from '../../src/modules/users/commands/handler/verify-email.handler'

jest.mock('uuid') // uuid 모듈을 모킹하여 테스트에 고정된 토큰 사용

describe('VerifyEmailHandler', () => {
  let handler: VerifyEmailHandler
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyEmailHandler,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
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

    handler = module.get<VerifyEmailHandler>(VerifyEmailHandler)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should throw BadRequestException if user does not exists', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findFirst = jest.fn().mockResolvedValue(undefined)

    const command = new VerifyEmailCommand('mocked-uuid-token')

    // When & Then: 사용자가 없을 때 BadRequestException이 발생해야 한다
    await expect(handler.execute(command)).rejects.toThrow(BadRequestException)
  })

  it('should verify email', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findFirst = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' })

    const mockToken = 'mocked-uuid-token';
    const command = new VerifyEmailCommand(mockToken)

    // When: 새로운 사용자를 생성
    await handler.execute(command)

  })
})
