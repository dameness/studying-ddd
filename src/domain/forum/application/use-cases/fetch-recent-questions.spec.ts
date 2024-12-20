import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
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

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);

    expect(result.value?.questions).toHaveLength(3);
    expect(result.value?.questions[0]).toMatchObject({
      createdAt: new Date(2022, 0, 20),
    });
    expect(result.value?.questions[2]).toMatchObject({
      createdAt: new Date(2018, 0, 20),
    });
  });

  it('should be able to fetch recent questions with pagination', async () => {
    for (let i = 0; i < 35; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ createdAt: new Date(i, 0) })
      );
    }

    const result = await sut.execute({ page: 2 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toHaveLength(15);
    expect(result.value?.questions[0].createdAt).toEqual(new Date(14, 0));
    expect(result.value?.questions[14].createdAt).toEqual(new Date(0, 0));
  });
});
