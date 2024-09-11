import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../src/common/prisma/prisma.service'
import { LoginHandler } from '../../src/modules/users/commands/handler'
import { LoginCommand } from '../../src/modules/users/commands/login.command'

describe('LoginHandler', () => {
  let handler: LoginHandler
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    handler = module.get<LoginHandler>(LoginHandler)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should throw BadRequestException if user does not exists', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findUnique = jest.fn().mockResolvedValue(undefined)

    const command = new LoginCommand('test@example.com', '1234')

    // When & Then: 사용자가 없을 때 BadRequestException이 발생해야 한다
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
  })

  it('should login', async () => {
    // Given: 유저가 존재하지 않는 경우
    prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' })

    const command = new LoginCommand('test@example.com', '1234')

    // When: 새로운 사용자를 생성
    await expect(handler.execute(command)).resolves.toEqual(true)
  })
})
