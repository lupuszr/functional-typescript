import { Applicative } from "./Applicative";
import { Chain } from "./Chain";
import daggy, { TaggedSumInstance, TaggedSumConstructor } from "daggy"

type f<T, K> = (a: K) => T
type g<T, K> = (b: K) => T
type h<T, K> = (c: K) => T
export interface Monad<T, K> extends Applicative<T, K>, Chain<T, K> {
  // (a -> mb) -> (b -> mc) -> (a -> mc)
  // L ~ b
  // U ~ mb
  // V ~ mc
  [">=>"]: <L, U, V>(this: f<U, K>) => (b: g<V, L>) => h<V, K>
  // mma -> ma
  // R ~ mma
  // V ~ ma
  join: <R extends TaggedSumInstance<R>, V extends TaggedSumInstance<V>>(this: R) => V
}