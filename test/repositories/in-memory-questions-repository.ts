import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex(
      (it) => it.id.toString() === question.id.toString()
    );

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(questionId: string) {
    this.items = this.items.filter((it) => it.id.toString() !== questionId);
    this.questionAttachmentsRepository.deleteManyByQuestionId(questionId);
  }

  async findManyRecent({ page }: PaginationParams) {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
  }

  async findById(id: string) {
    const question = this.items.find((it) => it.id.toString() === id);

    return question ?? null;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((it) => it.slug.value === slug);

    return question ?? null;
  }
}
