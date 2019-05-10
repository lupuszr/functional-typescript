import daggy, { TaggedInstance, TaggedConstructor } from "daggy";
import curry, { Curry } from "ramda.curry";
import { Monoid } from "typeclasses/Monoid";
import { Setoid } from "typeclasses/Setoid";
import { Foldable } from "typeclasses/Foldable";
import { Monad } from "typeclasses/Monad";
import { Alt } from "typeclasses/Alt";
import StringS from "./StringE";

type R<T extends Function, C> = Reader<T, C>;
// Writer prototypes
export interface Proto<T extends Function, M> extends Alt<R<T, M>, T>, Setoid<R<T, M>>, Monad<R<T, M>, T>, Foldable<T> {
  //runReader: (this: R<T, M>, config: M) => T;
  map: <L>(this: R<T, M>, fn: Function) => L & R<T, M>
}

type Extensions<T extends Function, M> = {
  fromArray: (xs: Array<T>) => R<T, M>
}
// Writer instance interface
export interface Reader<T extends Function, M> extends TaggedInstance<Reader<T, M>>, Proto<T, M> {
  runReader: ((e: M) => T)
}

// Reader Constructor interface
export interface CReader<T extends Function, M> extends TaggedConstructor<CReader<T, M>>, Monad<R<T, M>, T>, Extensions<T, M> {
  new(...args: any[]): Reader<T, M>,
  prototype: Proto<T, M>
}


const ReaderConstructor = function <T extends Function = Function, M = {}>(): CReader<T, M> {
  // const Reader: CReader<T, M> = curry<T, M, Reader<T, M>, CReader<T, M>>(daggy.tagged("Reader", ["fn", "config"]));
  const Reader: CReader<T, M> = daggy.tagged("Reader", ["runReader"])
  // const a = curry<(typeName: string,  ...args: any) => CReader<T, M>>(daggy.tagged);
  // const r = a("Reader", ['fn', 'config'])
  

  // const Reader: CReader<T, M> = daggy.tagged("Reader", ['fn', 'config']);

  // Reader.prototype.runReader = function (config: M) {
  //   return this.fn(config);
  // }

  //(Writer(x, v)) >>= f = 
  //let(Writer(y, v')) = f x
  // return Writer (y, v `mappend` v')  
  Reader.of = function <J>(fn: J): R<T, M> {
    return new Reader(fn)
  }

  // Reader.prototype.chain = function<U>(this: R<T, M>, fn: (a: T) => U) {
  //   return fn()
  // }
  // Reader.prototype.chain = function <U>(this: R<T, M>, fn: (arg0: T) => U) {
  //   return fn(x => this.fn(x).runReader())
  //   // const v1: Reader<T, M> = <Reader<T, M>><{}>fn(this.a);
  //   // return <U><{}>new Writer(v1.a, this.v.concat(v1.v));
  // }
  Reader.prototype.map = function<L>(this: R<T, M>, fn: Function) {
    return <L><unknown>new Reader((config: M) => fn(this.runReader(config)))
  }

  Reader.prototype.chain = function<U>(this: R<T, M>, fn: Function): U {
    return <U><unknown>new Reader((config: M) => fn(<M><unknown>this.runReader(config)).runReader(config))
  }

  return Reader;
}


export default ReaderConstructor;


// const a = curry<(typeName: string, ...args: any) => CReader<Function, string>>(daggy.tagged);
// let r = curry<(a: any) => any, {}, Reader<Function, string>, {}>(daggy.tagged("Reader", ["fn", "config"])); //(["3"])
// console.log(r((a: string) => a)({a: 1}));
const RC = ReaderConstructor<(a: number) => number, number>();
// const R: Reader<() => number, {}> = RC(() => 1)({})
const a = new RC((a: number) => a * 4);
const l = a
  .map((x: number) => x + 2)
  .map((l: number) => l + 10)
  .chain((x: number) => new RC((e: number) => x + e))
  .runReader(2)
console.log(l)

// import Control.Monad.Reader

// hello:: Reader String String
// hello = do
//   name < - ask
//     return ("hello, " ++ name++ "!")

// bye:: Reader String String
// bye = do
//   name < - ask
//     return ("bye, " ++ name++ "!")

// convo:: Reader String String
// convo = do
//   c1 < - hello
//     c2 < - bye
//     return $ c1++ c2

// main = print.runReader convo $ "adit"

const hello = () => new RC(user => "hello " + user.firstName + ":)");
const age = last => new RC(user => last + "\nage: " + user.age)
const bye = last => new RC(user => last + "\nbye " + user.fullName);

const x = 
  hello()
  .chain(age)
  .chain(bye)
  .runReader({firstName: "Pista", fullName: "Pista Balga", age: 12})

console.log(x)
// const inj = new RC((a: {}) => a)
//   .map(o => ({...o, b: 3}))
//   .chain(x => new RC(l => [x, l]))
//   .runReader({a: 1})
//console.log(inj)
// const a = RC.of((a: number) => (config: number) => a + config)
// console.log(a.chain((x: Function) => RC.of((a: number) => (config: number) => x(a + 1 + config))).runReader(1)(2)(3));
