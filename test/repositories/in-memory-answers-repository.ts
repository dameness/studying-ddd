import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex(
      (it) => it.id.toString() === answer.id.toString()
    );

    this.items[itemIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answerId: string) {
    this.items = this.items.filter((it) => it.id.toString() !== answerId);
    this.answerAttachmentsRepository.deleteManyByAnswerId(answerId);
  }

  async findById(id: string) {
    const answer = this.items.find((it) => it.id.toString() === id);

    return answer ?? null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.items
      .filter((it) => it.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
  }
}
