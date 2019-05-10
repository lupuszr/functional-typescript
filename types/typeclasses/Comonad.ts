import { Extend } from "./Extend";

export interface Comonad<T, K> extends Extend<T, K> {
  // fantasy - land / extract :: Comonad w => w a ~> () -> a
  extract: (this: T) => K
}