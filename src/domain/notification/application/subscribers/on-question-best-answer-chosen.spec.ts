import { makeAnswer } from 'test/factories/make-answer';
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen';
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

describe('On Question Best Answer Chosen', () => {
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

    new OnQuestionBestAnswerChosen(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
      sendNotificationUseCase
    );
  });

  it('should send a notification when the best answer of a question is chosen', async () => {
    const question = makeQuestion();

    inMemoryQuestionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });

    await inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    expect(sendNotificationExecuteSpy).not.toHaveBeenCalled();

    await inMemoryQuestionsRepository.save(question);

    expect(sendNotificationExecuteSpy).toHaveBeenCalled();

    expect(inMemoryNotificationsRepository.items).toHaveLength(1);
  });
});
