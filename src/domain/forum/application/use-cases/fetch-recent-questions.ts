import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsUsecaseRequest {
  page: number;
}

interface FetchRecentQuestionsUsecaseResponse {
  questions: Question[];
}

export class FetchRecentQuestionsUsecase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUsecaseRequest): Promise<FetchRecentQuestionsUsecaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return {
      questions,
    };
  }
}
