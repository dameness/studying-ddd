import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

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

    const result = await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId,
    });

    expect(result.isRight()).toBe(true);

    const question = await inMemoryQuestionCommentsRepository.findById(
      questionCommentId
    );

    expect(question).toBe(null);
  });

  it('should not be able to delete a question comment with invalid id', async () => {
    const result = await sut.execute({
      authorId: 'any',
      questionCommentId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete a question comment of a different author', async () => {
    const newQuestionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const questionCommentId = newQuestionComment.id.toString();

    const result = await sut.execute({
      authorId: 'not-the-id',
      questionCommentId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
