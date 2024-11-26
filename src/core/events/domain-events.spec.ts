import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

describe('Domain Events', () => {
  it('should be able do dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    // Subscriber registered (listening to creation of aggregate (question, answer, ...))
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Creating an event for the aggregate (NOT PUSHED TO THE DATABASE)
    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);
    expect(callbackSpy).not.toHaveBeenCalled();

    // Dispatching the events of the aggregate (after they were pushed to the database)
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(aggregate.domainEvents).toHaveLength(0);

    // Subscriber listen to the event and execute the callback function
    expect(callbackSpy).toHaveBeenCalled();
  });
});
