import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { DeleteQuestionUseCase } from './delete-question';
import { makeQuestion } from 'test/factories/make-question';

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

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId,
    });

    const question = await inMemoryQuestionsRepository.findById(questionId);

    expect(question).toBe(null);
  });

  it('should not be able to delete a question with invalid id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'any',
        questionId: 'any',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to delete a question of a different author', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const questionId = newQuestion.id.toString();

    await expect(() =>
      sut.execute({
        authorId: 'not-the-id',
        questionId,
      })
    ).rejects.toBeInstanceOf(Error); // improve error handling
  });
});
