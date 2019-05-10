import daggy, { TaggedInstance, TaggedConstructor } from "daggy";
import { Monoid } from "typeclasses/Monoid";
import { Setoid } from "typeclasses/Setoid";
import { Foldable } from "typeclasses/Foldable";
import { Monad } from "typeclasses/Monad";
import { Alt } from "typeclasses/Alt";
import StringS from "./StringE";

// newtype Writer w a = Writer { runWriter:: (a, w) }  


type Fn<T> = (a: T) => T;
// type MFn<T> = (a: T) => Writer<T>

type W<T, V extends Monoid<any>> = Writer<T, V>;
 // Writer prototypes
export interface Proto<T, M extends Monoid<any>> extends Alt<W<T, M>, T>, Setoid<W<T, M>>, Monad<W<T, M>, T>, Foldable<T> {
  runWriter: (this: W<T, M>, a: W<T, M>) => [T, M];
}

type Extensions<T, M extends Monoid<any>> = {
  fromArray: (xs: Array<T>) => W<T, M>
}
// Writer instance interface
export interface Writer<T, M extends Monoid<any>> extends TaggedInstance<Writer<T, Monoid<M>>>, Proto<T, M> {
  a: T,
  v: M
}
//type Partial<T> = { [P in keyof T]?: T[P] }
// Writer Constructor interface
export interface CWriter<T, M extends Monoid<any>> extends TaggedConstructor<CWriter<T, M>>, Monad<W<T, M>, T>, Extensions<T, M> {
  new(...args: any[]): Writer<T, M>,
  prototype: Proto<T, M>
}
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

const WriterConstructor = function<T = any, M extends FunctionProperties<Monoid<any>> = StringS>(): CWriter<T, M> {  
  const Writer: CWriter<T, M> = daggy.tagged("Writer", ['a', 'v']);

  Writer.prototype.runWriter = function(a) {
    return [this.a, this.v];
  }

  //(Writer(x, v)) >>= f = 
  //let(Writer(y, v')) = f x
  // return Writer (y, v `mappend` v')  
  Writer.of = function<J>(v: J): W<T, M> {
    const monoid: M = arguments[1] || (new StringS(''));
    return new Writer(v, monoid.empty());
  }

  Writer.prototype.chain = function<U>(this: Writer<T, M>, fn: (arg0: T) => U){
    const v1: Writer<T, M> = <Writer<T, M>><{}>fn(this.a);
    return <U><{}>new Writer(v1.a, this.v.concat(v1.v));
  }
  // Writer.prototype.map = function(fn) {

  // }
  return Writer;
}

const W = WriterConstructor<number>();
const a = W.of(10);
console.log(a);
const x = a.chain(x => W.of(x + 2))
console.log(a.runWriter(a))
  // Functor Instance
  // Laws:
  // map(a => a) is equivalent to u (identity)
  // map(x => f(g(x))) is equivalent to map(g).map(f)(composition)
  //
  //
  // map :: Functor List => List a ~> (a -> b) -> List b
//   List.prototype.map = function(f) {
//     return this.cata({
//       Cons: (head, tail) => List.Cons(f(head), tail.map(f)),
//       Nil: () => List.Nil
//     });
//   };

//   // Setoid instance
//   // Laws:
//   // a.equals(a) === true(reflexivity)
//   // a.equals(b) === b.equals(a)(symmetry)
//   // If a.equals(b) and b.equals(c), then a.equals(c)(transitivity)
//   //
//   //
//   // equals :: Setoid List => List ~> List -> Boolean
//   List.prototype.equals = function(ls) {
//     return this.cata({
//       Cons: (head, tail) => {
//         return ls.cata({
//           Cons: (ohead, otail) => {
//             if (head !== ohead) {
//               return false;
//             }
//             return tail.equals(otail);
//           },
//           Nil: () => false
//         });
//       },
//       Nil: () => {
//         return ls.cata({
//           Cons: (_h, _o) => false,
//           Nil: () => true
//         });
//       }
//     });
//   };
  
//   // Semigroup instance
//   // concat :: Semigroup a => a ~> a -> a
//    List.prototype.concat = function(a) {
//     return this.cata({
//       Cons: (h, t) => {
//         return a.cata({
//           Cons: (hd, tail) => List.Cons(h, List.Cons(hd, t.concat(tail))),
//           Nil: () => this
//         })},
//       Nil: () => a
//     });
//   };

//   List.prototype.alt = List.prototype.concat;

//   // Monoid instance
//   // Laws:
//   // a.concat(List.empty()) is equivalent to a(right identity)
//   // List.empty()['fantasy-land/concat'](m) is equivalent to m(left identity)
//   //
//   // empty :: Monoid m => () -> m
//   List.empty = () => List.Nil;

//   type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
//   type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

//   //
//   // A value that implements the Apply specification must also implement the Functor specification.v['fantasy-land/ap'](u['fantasy-land/ap'](a['fantasy-land/map'](f => g => x => f(g(x)))))is equivalent to v['fantasy-land/ap'](u)['fantasy-land/ap'](a)(composition)

//   // fantasy - land / ap method
//   // fantasy - land / ap :: Apply f => f a ~> f(a - > b) - > f b
//   // type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
//   // type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

//   // type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R

//   List.prototype.ap = function (lfn) {
//     return lfn.cata({
//       Cons: (h, t) =>
//         this.map(h).concat(this.ap(t)),
//       Nil: () => List.Nil
//     })
    
//   }

//   // Applicative
//   // A value that implements the Applicative specification must also implement the Apply specification.v['fantasy-land/ap'](A['fantasy-land/of'](x => x))is equivalent to v(identity)
//   // A['fantasy-land/of'](x)['fantasy-land/ap'](A['fantasy-land/of'](f))is equivalent to A['fantasy-land/of'](f(x))(homomorphism)
//   // A['fantasy-land/of'](y)['fantasy-land/ap'](u)is equivalent to u['fantasy-land/ap'](A['fantasy-land/of'](f => f(y)))(interchange)

//   // fantasy - land / of method
//   List.of = function(a) {
//     return List.Cons(a, List.Nil);
//   }

//   // Natural Transformations
//   // from :: [a] -> List a
//   List.fromArray = function(xs: Array<T>): List<T> {
//     return xs.reduceRight((acc, x) => List.Cons(x, acc), List.Nil);
//   };

//   // toArray :: List a -> [a]
//   // List.toArray = function(ls) {
//   //   return ls.cata({
//   //     Cons: (x, acc) => [x, ...List.toArray(acc)],
//   //     Nil: () => []
//   //   });
//   // };
  
//   // Monad a => Ma -> (a -> Mb) -> Mb
//   List.prototype.chain = function(this: List<T>, fn) {
//     return this.cata({
//       Cons: (head, tail) =>
//         fn(head).cata({
//           Cons: (hf, _tail) => List.Cons(hf, tail.chain(fn)),
//           Nil: () => List.Nil
//         }),
//       Nil: () => List.Nil
//     });
//   };

// // u['fantasy-land/reduce']is equivalent to u['fantasy-land/reduce']((acc, x) => acc.concat([x]), []).reduce

// // fantasy - land / reduce method
//   List.prototype.reduce = function<K>(this: List<T>, fn: (acc: K, curr: T) => K, acc: K): K {
//     return this.cata({
//       Cons: (head, tail) => tail.reduce(fn, fn(acc, head)),
//       Nil: () => acc
//     })
//   }

//   return List;
// }



//  type A = [List<string>, (a: number) => string]

// const L = ListConstructor<number>();
// const K = ListConstructor<(a: number) => string>();
// const O = ListConstructor<string>();
// const x = L.Cons(1, L.Cons(2, L.Nil)).map(a => a + 1)
// const k = L.of(2);
// const rp = x.concat(L.Nil)
// console.log(rp)
// const y = x.map<A[0], A[1]>(() => "a + 1")
// const r = x.chain<List<string>>(a => O.Cons("1" + a, O.Nil))
// const p = r.chain<List<number>>(a => L.Cons(+a.concat("0"), K.Nil))
// console.log(p.concat(x))
// const tr  = r.map(a => a + "hi");
// const t = L.Cons(3, L.Cons(5, K.Nil)).ap<List<string>, List<(a: number) => string>>(K.Cons((a: number) => a + "3", K.Cons((b: number) => b + "8", K.Nil)))
// // console.log(L.Nil.concat(L.Cons(10, L.Nil)))
// // console.log("pina:", t.tail.tail);
// console.log("pina:", t.reduce((acc, curr) => acc + "," +curr, ""));
// // L.Cons(2, L.Nil).equals(L.Cons(1, L.Nil))
// // L.Cons(1, L.Nil).map
// // console.log(x.ap(t))
// const a = L.fromArray(Array.from(Array(1000)).map((a, i) => i))
// console.log(a)

export default WriterConstructor;



