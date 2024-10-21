import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { EditQuestionUseCase } from './edit-question';
import { makeQuestion } from 'test/factories/make-question';

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

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId,
      content: 'edited content',
      title: 'edited title',
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'edited content',
      title: 'edited title',
    });
  });

  it('should not be able to edit a question with invalid id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'any',
        questionId: 'any',
        content: 'edited content',
        title: 'edited title',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to edit a question of a different author', async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const questionId = newQuestion.id.toString();

    await expect(() =>
      sut.execute({
        authorId: 'not-the-id',
        questionId,
        content: 'edited content',
        title: 'edited title',
      })
    ).rejects.toBeInstanceOf(Error); // improve error handling
  });
});
