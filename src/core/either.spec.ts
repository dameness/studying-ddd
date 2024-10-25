import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) return right('success');

  return left('error');
}

it('should be able to send an error result', () => {
  const result = doSomething(false);

  expect(result.isLeft()).toBe(true);
  expect(result.isRight()).toBe(false);
});

it('should be able to have a successful result', () => {
  const result = doSomething(true);

  expect(result.isLeft()).toBe(false);
  expect(result.isRight()).toBe(true);
});
