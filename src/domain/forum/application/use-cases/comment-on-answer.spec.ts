import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { makeAnswer } from 'test/factories/make-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    );
  });

  it('should be able to comment on answer', async () => {
    const newAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'Test',
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Test');
  });
});
