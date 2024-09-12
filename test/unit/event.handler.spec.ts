import { Test, TestingModule } from '@nestjs/testing'
import { TestEvent } from '../../src/modules/users/events/test.events'
import { UserEventsHandler } from '../../src/modules/users/handler'
import { UserCreateEvent } from '../../src/modules/users/events/user-create.events'
// import { EmailService } from '../../../../common/services/email.service'; // EmailService 주석 해제 가능

describe('UserEventsHandler', () => {
  let eventHandler: UserEventsHandler

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserEventsHandler,
        // {
        //   provide: EmailService, // 이메일 서비스 모킹 (필요할 경우 추가)
        //   useValue: { sendMemberJoinVerification: jest.fn() },
        // },
      ],
    }).compile()

    eventHandler = module.get<UserEventsHandler>(UserEventsHandler)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle UserCreateEvent', async () => {
    const event = new UserCreateEvent('test@example.com', 'test-token')

    const consoleSpy = jest.spyOn(console, 'log')

    await eventHandler.handle(event)

    expect(consoleSpy).toHaveBeenCalledWith('UserCreatedEvent!')
    // 이메일 서비스 호출 여부 확인 (필요할 경우)
    // expect(mockEmailService.sendMemberJoinVerification).toHaveBeenCalledWith(
    //   event.email,
    //   event.signupVerifyToken,
    // );
  })

  it('should handle TestEvent', async () => {
    const event = new TestEvent()

    const consoleSpy = jest.spyOn(console, 'log')

    await eventHandler.handle(event)

    expect(consoleSpy).toHaveBeenCalledWith('TestEvent!')
  })

  it('should do nothing for unknown events', async () => {
    const event = { name: 'UnknownEvent' } // 임의의 이벤트

    const consoleSpy = jest.spyOn(console, 'log')

    await eventHandler.handle(event as any)

    expect(consoleSpy).not.toHaveBeenCalled() // 콘솔에 아무 출력도 없음
  })
})
