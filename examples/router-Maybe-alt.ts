import MaybeConstructor, { Maybe } from "../structures/Maybe";

const MaybeF = MaybeConstructor<() => string>();
const Maybe = MaybeConstructor();
const MaybeS = MaybeConstructor<string>()


type ResultFn = () => any
function match(comparator: () => boolean, res: ResultFn): Maybe<ResultFn> {
  switch (comparator()) {
    case true: return Maybe.of(res);
    default: return Maybe.Nothing;
  }
}

const router = (route: string) =>
  MaybeF.Nothing
    .alt(match(() => route === "home", () => "navigate to home"))
    .alt(match(() => route === "edit", () => "navigate to edit"))
    .alt(match(() => route === "about", () => "navigate to about"))

const k = router("about").chain<Maybe<string>>(e => Maybe.of(e()))
console.log(Maybe["@@tags"], Maybe.Nothing);