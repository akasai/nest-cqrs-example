import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { PrismaService } from '../src/modules/prisma.service'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prismaService: PrismaService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(PrismaService)
      .useValue({
        user: {
          create: jest.fn(), // PrismaService의 user.create 메서드를 모킹
        },
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    prismaService = moduleFixture.get<PrismaService>(PrismaService)
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  it('/users (POST) should sign up a user', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' }
    const createdUser = { id: 1, ...userData };

    (prismaService.user.create as jest.Mock).mockResolvedValue(createdUser)

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201)

    expect(response.body).toEqual(createdUser)
  })

  afterAll(async () => {
    await app.close()
  })
})
