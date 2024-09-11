import { INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import * as uuid from 'uuid'
import { PrismaService } from '../src/common/prisma/prisma.service'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let commandBus: CommandBus

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CommandBus)
      .useValue({
        register: jest.fn(), // CommandBus load를 위해 모킹
        execute: jest.fn(), // CommandBus의 execute 메서드를 모킹
      })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          // create: jest.fn(), // PrismaService의 user.create 메서드를 모킹
          findUnique: jest.fn(), // PrismaService의 user.create 메서드를 모킹
          delete: jest.fn(), // PrismaService의 user.delete 메서드를 모킹
        },
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    prismaService = moduleFixture.get<PrismaService>(PrismaService)
    commandBus = moduleFixture.get<CommandBus>(CommandBus)
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  it('/users (POST) should sign up a user', async () => {
    const userData = { name: 'Test User', email: 'test2@example.com', password: '1234' }
    const createdUser = { id: 1, ...userData };

    // CommandBus의 execute 메서드 모킹
    (commandBus.execute as jest.Mock).mockResolvedValue(createdUser)

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201)

    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(Object)) // CreateUserCommand가 호출됨을 확인
    expect(response.body).toEqual(createdUser)
  })

  it('/users/verify-email (POST) should sign up a user', async () => {
    const token = uuid.v4();

    // CommandBus의 execute 메서드 모킹
    (commandBus.execute as jest.Mock).mockResolvedValue(true)

    const response = await request(app.getHttpServer())
      .post('/users/verify-email')
      .send(token)
      .expect(201)

    expect(commandBus.execute).toHaveBeenCalled() // CreateUserCommand가 호출됨을 확인
    expect(response.body).toEqual({})
  })

  it('/users/login (POST) should sign up a user', async () => {
    const userData = { email: 'test2@example.com', password: '1234' };
      // CommandBus의 execute 메서드 모킹
    (commandBus.execute as jest.Mock).mockResolvedValue(true)

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(userData)
      .expect(201)

    expect(commandBus.execute).toHaveBeenCalled() // CreateUserCommand가 호출됨을 확인
    expect(response.body).toEqual({})
  })

  it('/users/1 (GET) should get a user', async () => {
    const userId = 1
    const createdUser = { id: 1, name: 'Test User', email: 'test@example.com' }

    ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue(createdUser)

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)

    expect(response.body).toEqual(createdUser)
  })

  it('/users/1 (DELETE) should delete a user', async () => {
    const userId = 1
    const createdUser = { id: 1, name: 'Test User', email: 'test@example.com' }

    ;(prismaService.user.delete as jest.Mock).mockResolvedValue(createdUser)

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200)

    expect(response.body).toEqual(createdUser)
  })

  afterAll(async () => {
    await app.close()
  })
})
