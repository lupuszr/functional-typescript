import { Functor } from "./Functor";
import { TaggedSumInstance } from "daggy";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R
export interface F<T> {}
type KIO<A, T> = Merge<F<A>, T>;
export interface Apply<T, K> extends Functor<T, K>{
  // ap: <R, U = any>(this: T, lfn: any) => U
  // ap: <R, U extends Merge<R, T>>(this: T, lfn: KIO<(a: K) => R, T>) => U
  ap: <L, U extends TaggedSumInstance<any>>(this: T, lfn: U) => L
}
// fantasy - land / ap :: Apply f => f a ~> f(a - > b) - > f b