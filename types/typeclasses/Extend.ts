import { Functor } from "./Functor";
import { TaggedSumInstance } from "daggy";

export interface Extend<T, K> extends Functor<T, K> {
  //fantasy - land / extend :: Extend w => w a ~> (w a -> b) -> w b
  extend: <L, U extends TaggedSumInstance<any>>(this: T, lfn: (a: T) => L) => U
}