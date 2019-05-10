export interface Foldable<T> {
  // reduce: <L>(this: any, fn: (a: T) => any) => L
  reduce: <L>(this: any, fn: (acc: L, a: T) => L, acc: L) => L
}