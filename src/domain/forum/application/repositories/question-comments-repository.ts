import { QuestionComment } from '../../enterprise/entities/question-comment';

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>;
  delete(questionCommentId: string): Promise<void>;
  findById(questionCommentId: string): Promise<QuestionComment | null>;
}
