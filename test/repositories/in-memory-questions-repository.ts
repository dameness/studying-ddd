import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  async create(question: Question) {
    this.items.push(question);
  }

  async delete(questionId: string) {
    this.items = this.items.filter((it) => it.id.toString() !== questionId);
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
