import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should be able to fetch question answers', async () => {
    for (let i = 0; i < 5; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID(i % 2 === 0 ? '1' : '2') })
      );
    }

    const { answers } = await sut.execute({ questionId: '1', page: 1 });

    expect(answers).toHaveLength(3);
  });

  it('should be able to fetch question answers with pagination', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('1') })
      );
    }

    const { answers } = await sut.execute({ questionId: '1', page: 2 });

    expect(answers).toHaveLength(2);
  });
});
