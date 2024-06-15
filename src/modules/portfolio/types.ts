export interface IPortfolio {
  positions: IPosition[];
  balance: number;
}

export interface IPosition {
  figi: string;
  instrumentType: string;
  averagePositionPrice: number;
  quantity: number;
}
