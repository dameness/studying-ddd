import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const questionCommentId = newQuestionComment.id.toString();

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId,
    });

    const question = await inMemoryQuestionCommentsRepository.findById(
      questionCommentId
    );

    expect(question).toBe(null);
  });

  it('should not be able to delete a question comment with invalid id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'any',
        questionCommentId: 'any',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to delete a question comment of a different author', async () => {
    const newQuestionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const questionCommentId = newQuestionComment.id.toString();

    await expect(() =>
      sut.execute({
        authorId: 'not-the-id',
        questionCommentId,
      })
    ).rejects.toBeInstanceOf(Error); // improve error handling
  });
});
