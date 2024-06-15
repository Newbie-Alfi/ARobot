export type FIGI = string;

export interface IPosition {
  figi: string;
  instrumentType: string;
  totalAmount: number;
}

export interface IPortfolioConstruction {
  addPosition(position: IPosition): void;
  removePosition(figi: FIGI): void;
  setPositions(positions: IPosition[]): void;
  getMaxDealAmountByFigi(figi: FIGI): number;
  // TODO: Убрать из типа. Этот метод актуален только для EqualWeights
  setBalance(value: number): void;
}
