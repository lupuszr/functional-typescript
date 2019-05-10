export interface Semigroup<T> {
  concat(this: T, other: T): T
}