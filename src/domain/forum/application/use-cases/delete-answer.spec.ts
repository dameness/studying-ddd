import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

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

    const result = await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId,
    });

    expect(result.isRight()).toBe(true);

    const answer = await inMemoryAnswersRepository.findById(answerId);

    expect(answer).toBe(null);
  });

  it('should not be able to delete an answer with invalid id', async () => {
    const result = await sut.execute({
      authorId: 'any',
      answerId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete an answer of a different author', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    const answerId = newAnswer.id.toString();

    const result = await sut.execute({
      authorId: 'not-the-id',
      answerId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
