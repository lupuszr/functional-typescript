export interface Curry<T1, T2, R> {
  (t1: T1): <T2>(t2: T2) => R
  (t1: T1, t2: T2): R
}

declare function curry<T1, T2, R, L>(f: (t1: T1, t2: T2) => R): Curry<T1, T2, R> & L
export default curry;