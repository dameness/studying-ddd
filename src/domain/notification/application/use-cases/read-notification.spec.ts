import { ReadNotificationUseCase } from './read-notification';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { makeNotification } from 'test/factories/make-notification';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.items[0]).toEqual(
        result.value.notification
      );
      expect(result.value.notification.readAt).toEqual(expect.any(Date));
    }
  });

  it('should not be able to read a notification of another recipient', async () => {
    const newNotification = makeNotification();

    await inMemoryNotificationsRepository.create(newNotification);

    const notificationId = newNotification.id.toString();

    const result = await sut.execute({
      recipientId: 'not-the-id',
      notificationId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
