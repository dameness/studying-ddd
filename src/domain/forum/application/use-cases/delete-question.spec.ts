import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { DeleteQuestionUseCase } from './delete-question';
import { makeQuestion } from 'test/factories/make-question';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const questionId = newQuestion.id.toString();

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId,
    });

    expect(result.isRight()).toBe(true);

    const question = await inMemoryQuestionsRepository.findById(questionId);

    expect(question).toBe(null);
  });

  it('should not be able to delete a question with invalid id', async () => {
    const result = await sut.execute({
      authorId: 'any',
      questionId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete a question of a different author', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const questionId = newQuestion.id.toString();

    const result = await sut.execute({
      authorId: 'not-the-id',
      questionId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
