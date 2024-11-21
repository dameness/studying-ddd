import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex(
      (it) => it.id.toString() === notification.id.toString()
    );

    this.items[itemIndex] = notification;
  }

  async findById(recipientId: string) {
    const notification = this.items.find(
      (it) => it.id.toString() === recipientId
    );

    return notification ?? null;
  }
}
