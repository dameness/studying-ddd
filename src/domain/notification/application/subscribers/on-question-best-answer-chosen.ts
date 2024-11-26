import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this), // use 'this' of OnQuestionBestAnswerChosen, not of the next function
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      question.bestAnswerId ? question.bestAnswerId.toString() : ''
    );

    if (!answer) return;

    await this.sendNotificationUseCase.execute({
      recipientId: answer.authorId.toString(),
      title: 'Your answer was chosen as best answer!',
      content: `The answer you submitted in ${question.title
        .substring(0, 20)
        .concat('...')} was chosen as the best answer!`,
    });
  }
}
