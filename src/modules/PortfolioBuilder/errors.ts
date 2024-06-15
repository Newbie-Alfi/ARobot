export class InvalidBalance extends Error {
  constructor(builder: string, value: unknown) {
    const message = `Невалидное значение баланса модели построения портфеля - ${builder}. Баланс модели построения портфеля не может быть равен ${value}`;

    super(message);
  }
}
