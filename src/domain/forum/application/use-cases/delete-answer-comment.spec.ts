import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to delete an answer comment', async () => {
    const newAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const answerCommentId = newAnswerComment.id.toString();

    const result = await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId,
    });

    expect(result.isRight()).toBe(true);

    const answer = await inMemoryAnswerCommentsRepository.findById(
      answerCommentId
    );

    expect(answer).toBe(null);
  });

  it('should not be able to delete an answer comment with invalid id', async () => {
    const result = await sut.execute({
      authorId: 'any',
      answerCommentId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete an answer comment of a different author', async () => {
    const newAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const answerCommentId = newAnswerComment.id.toString();

    const result = await sut.execute({
      authorId: 'not-the-id',
      answerCommentId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
