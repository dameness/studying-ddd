import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionCommentId: string) {
    this.items = this.items.filter(
      (it) => it.id.toString() !== questionCommentId
    );
  }

  async findById(questionCommentId: string) {
    const questionComment = this.items.find(
      (it) => it.id.toString() === questionCommentId
    );

    return questionComment ?? null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.items
      .filter((it) => it.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
  }
}
