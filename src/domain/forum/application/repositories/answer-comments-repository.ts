import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>;
  delete(answerCommentId: string): Promise<void>;
  findById(answerCommentId: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>;
}
