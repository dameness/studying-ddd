import { PaginationParams } from '@/core/repositories/pagination-params';
import { Question } from '../../enterprise/entities/question';

export interface QuestionsRepository {
  create(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
  delete(questionId: string): Promise<void>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  findById(questionId: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
}
