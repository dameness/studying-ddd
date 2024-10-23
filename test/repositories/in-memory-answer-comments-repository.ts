import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

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
}
