import { Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  delete(answerId: string): Promise<void>;
  findById(answerId: string): Promise<Answer | null>;
}
