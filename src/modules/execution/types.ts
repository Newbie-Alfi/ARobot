export interface IExection {
  buy(figi: string, price: number, quantity: number): Promise<void>;
  sell(figi: string, price: number, quantity: number): Promise<void>;
}
