import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchRecentQuestionsUsecase } from './fetch-recent-questions';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUsecase;

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUsecase(inMemoryQuestionsRepository);
  });

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2018, 0, 20),
      })
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 0, 20),
      })
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2020, 0, 20),
      })
    );

    const { questions } = await sut.execute({ page: 1 });

    expect(questions).toHaveLength(3);
    expect(questions[0]).toMatchObject({ createdAt: new Date(2022, 0, 20) });
    expect(questions[2]).toMatchObject({ createdAt: new Date(2018, 0, 20) });
  });

  it('should be able to fetch recent questions with pagination', async () => {
    for (let i = 0; i < 35; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ createdAt: new Date(i, 0) })
      );
    }

    const { questions } = await sut.execute({ page: 2 });

    expect(questions).toHaveLength(15);
    expect(questions[0].createdAt).toEqual(new Date(14, 0));
    expect(questions[14].createdAt).toEqual(new Date(0, 0));
  });
});
