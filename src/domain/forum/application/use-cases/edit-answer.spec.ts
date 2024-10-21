import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer';

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

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId,
      content: 'edited content',
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'edited content',
    });
  });

  it('should not be able to edit an answer with invalid id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'any',
        answerId: 'any',
        content: 'edited content',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to edit an answer of a different author', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    const answerId = newAnswer.id.toString();

    await expect(() =>
      sut.execute({
        authorId: 'not-the-id',
        answerId,
        content: 'edited content',
      })
    ).rejects.toBeInstanceOf(Error); // improve error handling
  });
});
