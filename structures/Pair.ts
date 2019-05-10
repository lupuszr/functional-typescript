import daggy, { TaggedInstance, TaggedConstructor } from "daggy";
import curry, { Curry } from "ramda.curry";
import { Monoid } from "typeclasses/Monoid";
import { Setoid } from "typeclasses/Setoid";
import { Foldable } from "typeclasses/Foldable";
import { Monad } from "typeclasses/Monad";
import { Alt } from "typeclasses/Alt";
import StringS from "./StringE";

// Pair instance interface
export interface Pair<A, B> extends TaggedInstance<Pair<A, B>> {
  a: A,
  b: B
}

// Pair Constructor interface
export interface CPair<A, B> extends TaggedConstructor<CPair<A, B>>, Extensions<T, M> {
  new(...args: any[]): Pair<A, B>,
  // prototype: Proto<T, M>
}


const PairConstructor = function <A, B>(): CPair<A, B> {
  const Pair: CPair<A, B> = daggy.tagged("Pair", ["a", "b"])
  

  return Pair;
}


export default Pair;

