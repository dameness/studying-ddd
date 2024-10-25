import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    );
  });

  it('should be able to choose the best answer for a question', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]).toEqual(
        result.value?.question
      );
    }
  });

  it('should not be able to select best answer if its not the question author', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'not-the-author',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
