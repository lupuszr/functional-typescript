import { Apply } from "./Apply";

export interface Applicative<T, K> extends Apply<T, K> {
  of<J = K>(a: J): T
}