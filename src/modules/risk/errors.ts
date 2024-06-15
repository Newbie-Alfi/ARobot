export class InvalidTransactionValueError extends Error {
  constructor(maxSize: unknown) {
    const message = `Невалидное ограничение величины сделки = ${maxSize}`;

    super(message);
  }
}

export class InvalidBalanceError extends Error {
  constructor(balance: unknown) {
    const message = `Невалидное значение баланса портфеля ${balance}`;

    super(message);
  }
}
