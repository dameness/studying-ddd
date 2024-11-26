import { makeAnswer } from 'test/factories/make-answer';
import { OnAnswerCreated } from './on-answer-created';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

let sendNotificationExecuteSpy: any;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository()
    );

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository()
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when a new answer is created', async () => {
    const question = makeQuestion();

    inMemoryQuestionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });

    expect(answer.domainEvents).toHaveLength(1);

    await inMemoryAnswersRepository.create(answer);

    expect(answer.domainEvents).toHaveLength(0);

    expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    expect(inMemoryNotificationsRepository.items).toHaveLength(1);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        content: answer.excerpt,
      })
    );
  });
});
