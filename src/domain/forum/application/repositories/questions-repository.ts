import { Question, QuestionProps } from '../../enterprise/entities/question';

export interface QuestionsRepository {
  create(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
  delete(questionId: string): Promise<void>;
  findById(questionId: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
}
