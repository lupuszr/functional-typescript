import { Functor } from "./Functor";
import { TaggedSumInstance, TaggedInstance } from "daggy";

export type Constructor<T = {}> = new (...args: any[]) => T

type InstanceTypes<T> = {
  [P in keyof T]: T[P] extends Constructor<infer U> ? U : never
}
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;


export interface Chain<T, K> extends Functor<T, K>{
  // chain: <L>(this: T, fn: (a: K) => any) => L
  chain: <U extends TaggedSumInstance<any> | TaggedInstance<any>>(this: T, fn: (a: K) => U) => U
}