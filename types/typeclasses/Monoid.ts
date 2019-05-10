import { Semigroup } from "./Semigroup";

export interface Monoid<A> extends Semigroup<A> {
  empty: (this: A) => A,
}