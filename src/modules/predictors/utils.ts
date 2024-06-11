export type Series = number[];

/**
 * Возвращает true если source1 пересек source2 сверху вниз
 */
export function crossover(source1: Series, source2: Series) {
  const [prev1, cur1] = source1.slice(-2);
  const [prev2, cur2] = source2.slice(-2);
  return cur1 > cur2 && prev1 < prev2;
}

/**
 * Возвращает true если source1 пересек source2 снизу вверх
 */
export function crossunder(source1: Series, source2: Series) {
  const [prev1, cur1] = source1.slice(-2);
  const [prev2, cur2] = source2.slice(-2);
  return cur1 < cur2 && prev1 > prev2;
}

/**
 * Возвращает серию из константы.
 */
export function toSeries(value: number, length: number): Series {
  return new Array(length).fill(value);
}
