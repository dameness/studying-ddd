import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Question } from '../../enterprise/entities/question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      title: 'Example Question',
    });

    inMemoryQuestionsRepository.items.push(newQuestion);

    const { question } = await sut.execute({
      slug: 'example-question',
    });

    expect(question.id).toBeTruthy();
  });

  it('should not be able to get a question with invalid slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'my_title',
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
