import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

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

    await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId,
    });

    const answer = await inMemoryAnswerCommentsRepository.findById(
      answerCommentId
    );

    expect(answer).toBe(null);
  });

  it('should not be able to delete an answer comment with invalid id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'any',
        answerCommentId: 'any',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to delete an answer comment of a different author', async () => {
    const newAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const answerCommentId = newAnswerComment.id.toString();

    await expect(() =>
      sut.execute({
        authorId: 'not-the-id',
        answerCommentId,
      })
    ).rejects.toBeInstanceOf(Error); // improve error handling
  });
});
