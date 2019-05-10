import MaybeConstructor, { Maybe } from "../structures/Maybe";

const MaybeN = MaybeConstructor<number>();

// check if our divider is zero
// if this is true return Nothing else 
// do the division and pack it inside Maybe.Just
const safeDiv = (a: number, b: number): Maybe<number> => {
  return b !== 0 ? MaybeN.of(a / b) : MaybeN.Nothing;
}

MaybeN.of(10) // lift our value into Maybe
  .chain<Maybe<number>>(a => safeDiv(a, 0)) //pass our value into safeDiv
  .alt(MaybeN.of(10000)) // fallback to 10000 if the incoming value is Nothing
  .map(a => a - 10) // do some additional operations
  .map(p => p * 2)
