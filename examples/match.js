
const cata = <T = any>(a: Maybe<T>, fn) => {
  a.cata({
    Just: l =>     
  })
}

  const match = Maybe.Nothing;
  
    match
    .match(Maybe.Just, a => mb)
    .match(Maybe.Nothing, () => mb)
  
  Maybe.prototype.match = function(cont, mfn) {
    this.cata({
      Just: a => cont(a).cata({
        Just: conta => mfn(conta),
        Nothing: () => this,
      }),
      Nothing: () => cont().cata({
        Just: () => this,
        Nothing: mfn()
      })
    })
  }