// Error
export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft = (): this is Left<L, R> => true;
  isRight = (): this is Right<L, R> => false;
}

// Success
export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft = (): this is Left<L, R> => false;
  isRight = (): this is Right<L, R> => true;
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value);
};

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value);
};
