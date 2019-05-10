import daggy, { TaggedSumInstance, TaggedSumConstructor } from "daggy";
import { Setoid } from "typeclasses/Setoid";
import { Monoid } from "typeclasses/Monoid";
import { Monad } from "typeclasses/Monad";
import { Foldable } from "typeclasses/Foldable";
import { Alt } from "typeclasses/Alt";

type Fn<T> = (a: T) => T;
type MFn<T> = (a: T) => Either<T>

export interface Proto<T> extends Alt<Either<T>, T>, Monoid<Either<T>>, Setoid<Either<T>>, Monad<Either<T>, T>, Foldable<T> {}

export interface Either<T> extends TaggedSumInstance<Either<T>>, Proto<T> {
  new(...args: any[]): T
}

export interface CEither<T = any> extends TaggedSumConstructor<Either<T>>, Monad<Either<T>, T> {
  Left(a: any) : Either<T>
  Right(a: any): Either<T>
  prototype: Proto<T>
}

const EitherConstructor = function<T = any>(): CEither<T> {
  const Either: CEither<T> = daggy.taggedSum('Either', {
    Left: ['a'],
    Right: ['a']
  })

  Either.prototype.map = function(fn) {
    return this.cata({
      Right: r => Either.Right(fn(r)),
      Left: l => Either.Left(l)
    })
  }

  Either.of = function<T>(a: T) {
    return Either.Right(a);
  }

  Either.prototype.equals = function(ot) {
    return this.cata({
      Right: r => ot.cata({
        Right: or => or === r,
        Left: () => false
      }),
      Left: l => ot.cata({
        Right: () => false,
        Left: ol => ol === l
      })
    })
  }

  // fantasy - land / reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
  // Either.prototype.reduce = function(this: Either<T>, fn, init) {
    
  // }

  Either.prototype.ap = function(cfn) {
    return cfn.cata({
      Right: fnr => this.cata({
        Right: r => fnr(r),
        Left: e => Either.Left(e)
      }),
      Left: e => Either.Left(e)
    })
  }

  Either.prototype.chain = function(fn) {
    return this.cata({
      Right: fn,
      Left: l => Either.Left(l)
    })
  }

  Either.prototype.alt = function(o): Either<T> {
    return this.cata({
      Right: _ => this,
      Left: () => o
    })
  }

  return Either;
}

export default EitherConstructor;

const E = EitherConstructor<string>();

const data = undefined;

const isUndefined = (a: any) => a === undefined || a === null ? E.Left("Empty") : E.Right(a);
const pd = E.of(data).chain(isUndefined)
console.log(pd)