import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>;
  delete(answerCommentId: string): Promise<void>;
  findById(answerCommentId: string): Promise<AnswerComment | null>;
}
