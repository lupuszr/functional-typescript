import { Functor } from "./Functor";

export interface Alt<T, L> extends Functor<T, L>{
  alt: (this: T, fn: T) => T
}