export interface Functor<T, A> {
  map: <L, K extends (a: A) => any>(this: T, fn: K) => L & T
}