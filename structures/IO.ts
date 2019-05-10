
interface IO <T> {
  (unsafeIO : Function): IO <T>;
  chain(fn : (a : T) => IO <T>): IO<T> 
  of(performUnsafeIO : (a : T) => T): IO <T>;
  fork(): IO<T>;
  map(fn : (a : T) => T): IO <T>;
  value: Function
  new(input: KIO<T>): IO<T>
};

type KIO <T> = (a : T) => T;
type FIO <T> = (a : T) => IO<T>;

function IO<T> (this : IO<T>, unsafeIO : (Function)) {
  this.value = unsafeIO;
  return this;
};

IO.prototype.chain = function <T> (fn : FIO <T>) {
  return fn(this.value())
}

function new_<T>(x : any, k : KIO<T>) {
  return new x(k);
}

IO.of = function <T>(performUnsafeIO : KIO<T>) : IO<T> {
  return new_(IO, performUnsafeIO);
}

IO.prototype.fork = function () {
  return new_(IO, this.value());
}

IO.prototype.map = function (fn : Function) {
  return new_(IO, () => fn(this.value()))
}

type convFnType<T, K> = (input: T) => K;
function convert <T,K>(io: IO<T>, fn: convFnType<T, K>) : IO<K> {
  return new_(IO, () => fn(io.value()))
}

// USAGE

const intToStr = (i: number): string => i + "";
const fn : ((a : number) => number) = a => a + 1.0;
const gn : ((a : string) => string) = g => g + " String";
const rndNum = IO.of(() => Math.random())
  .map(fn)
const b = convert(rndNum, intToStr).map(gn);


// IO { 10 } IO { "10" }

console.log(b.fork());