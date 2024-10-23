import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

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
}
