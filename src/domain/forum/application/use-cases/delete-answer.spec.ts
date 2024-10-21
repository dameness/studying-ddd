import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    const answerId = newAnswer.id.toString();

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId,
    });

    const answer = await inMemoryAnswersRepository.findById(answerId);

    expect(answer).toBe(null);
  });

  it('should not be able to delete an answer with invalid id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'any',
        answerId: 'any',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to delete an answer of a different author', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    const answerId = newAnswer.id.toString();

    await expect(() =>
      sut.execute({
        authorId: 'not-the-id',
        answerId,
      })
    ).rejects.toBeInstanceOf(Error); // improve error handling
  });
});
