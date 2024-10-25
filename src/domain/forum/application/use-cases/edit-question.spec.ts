import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { EditQuestionUseCase } from './edit-question';
import { makeQuestion } from 'test/factories/make-question';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const questionId = newQuestion.id.toString();

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId,
      content: 'edited content',
      title: 'edited title',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]).toEqual(
        result.value.question
      );
    }
  });

  it('should not be able to edit a question with invalid id', async () => {
    const result = await sut.execute({
      authorId: 'any',
      questionId: 'any',
      content: 'edited content',
      title: 'edited title',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a question of a different author', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const questionId = newQuestion.id.toString();

    const result = await sut.execute({
      authorId: 'not-the-id',
      questionId,
      content: 'edited content',
      title: 'edited title',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
