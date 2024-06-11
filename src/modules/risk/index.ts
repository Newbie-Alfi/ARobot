class RiskModule {
  // TODO: Убрать автоматом 0
  private _portfolioValue: number = 0;

  constructor(portfolioValue: number, private _maxSize: number = 0.03) {
    // TODO: Рефакторинг
    if (_maxSize > 0.1 || _maxSize <= 0) {
      throw new InvalidTransactionValueError(_maxSize);
    }

    // TODO: Добавить также проверку баланса портфеля
    this._portfolioValue = portfolioValue;
  }

  calc(amount: number) {
    const limit = this._portfolioValue * this._maxSize;

    return amount > limit ? limit : amount;
  }
}

class InvalidTransactionValueError extends Error {
  constructor(maxSize: number) {
    const message = `Опасное или невалидное ограничение величины сделки = ${
      maxSize * 100
    }%`;

    super(message);
  }
}
