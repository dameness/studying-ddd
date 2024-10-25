import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to edit an answer', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    const answerId = newAnswer.id.toString();

    const result = await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId,
      content: 'edited content',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryAnswersRepository.items[0]).toEqual(result.value.answer);
    }
  });

  it('should not be able to edit an answer with invalid id', async () => {
    const result = await sut.execute({
      authorId: 'any',
      answerId: 'any',
      content: 'edited content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit an answer of a different author', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    const answerId = newAnswer.id.toString();

    const result = await sut.execute({
      authorId: 'not-the-id',
      answerId,
      content: 'edited content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
