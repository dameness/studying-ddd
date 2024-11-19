import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    return this.items.filter((it) => it.questionId.toString() === questionId);
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(
      (it) => it.questionId.toString() !== questionId
    );
  }
}
