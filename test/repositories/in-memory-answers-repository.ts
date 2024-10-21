import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  async create(Answer: Answer) {
    this.items.push(Answer);
  }

  async delete(answerId: string) {
    this.items = this.items.filter((it) => it.id.toString() !== answerId);
  }

  async findById(id: string) {
    const answer = this.items.find((it) => it.id.toString() === id);

    return answer ?? null;
  }
}
