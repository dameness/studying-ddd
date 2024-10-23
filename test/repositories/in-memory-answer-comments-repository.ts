import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerCommentId: string) {
    this.items = this.items.filter(
      (it) => it.id.toString() !== answerCommentId
    );
  }

  async findById(answerCommentId: string) {
    const answerComment = this.items.find(
      (it) => it.id.toString() === answerCommentId
    );

    return answerComment ?? null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    return this.items
      .filter((it) => it.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);
  }
}
