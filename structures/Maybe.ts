import daggy, { TaggedSumInstance, TaggedSumConstructor } from "daggy";
import { Setoid } from "typeclasses/Setoid";
import { Monoid } from "typeclasses/Monoid";
import { Monad } from "typeclasses/Monad";
import { Foldable } from "typeclasses/Foldable";
import { Alt } from "typeclasses/Alt";

type Fn<T> = (a: T) => T;
type MFn<T> = (a: T) => Maybe<T>

export interface Proto<T> extends Alt<Maybe<T>, T>, Monoid<Maybe<T>>, Setoid<Maybe<T>>, Monad<Maybe<T>, T>, Foldable<T> {}

export interface Maybe<T> extends TaggedSumInstance<Maybe<T>>, Proto<T> {
  new(...args: any[]): T
}

export interface CMaybe<T = any> extends TaggedSumConstructor<Maybe<T>>, Monad<Maybe<T>, T> {
  Just(a: any) : Maybe<T>
  Nothing: Maybe<T>
  prototype: Proto<T>
}

const MaybeConstructor = function<T = any>(): CMaybe<T> {
  const Maybe: CMaybe<T> = daggy.taggedSum('Maybe', {
    Just: ['a'],
    Nothing: []
  })

  Maybe.prototype.map = function(fn) {
    return this.cata({
      Just: value => Maybe.Just(fn(value)),
      Nothing: () => this
    })
  }

  Maybe.of = function<J = T>(a: J) {
    return Maybe.Just(a);
  }

  Maybe.prototype.equals = function(ot) {
    return this.cata({
      Just: a => ot.cata({
        Just: o => a === o,
        Nothing: () => false
      }),
      Nothing: () => ot.cata({
        Just: _ => false,
        Nothing: () => true
      })
    })
  }

  // fantasy - land / reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
  Maybe.prototype.reduce = function(this: Maybe<T>, fn, init) {
    return this.cata({
      Just: a => fn(init, a),
      Nothing: () => init
    })
  }

  Maybe.prototype.ap = function(cfn) {
    return cfn.cata({
      Just: fn => this.cata({
        Just: value => Maybe.of(fn(value)),
        Nothing: () => this
      }),
      Nothing: () => this
    })
  }

  Maybe.prototype.join = function() {
    return this.cata({
      Join: a => a.cata({
        Join: (b: T) => b,
        Nothing: () => this,
      }),
      Nothing: () => this,
    })
  }

  Maybe.prototype.chain = function(fn) {
    return this.cata({
      Just: fn,
      Nothing: () => this
    })
  }

  Maybe.prototype.alt = function(o): Maybe<T> {
    return this.cata({
      Just: _ => this,
      Nothing: () => o
    })
  }

  return Maybe;
}

export default MaybeConstructor;
