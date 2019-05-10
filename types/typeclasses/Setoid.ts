export interface Setoid<A> {
  equals(this : A, ls : A) : Boolean
}
