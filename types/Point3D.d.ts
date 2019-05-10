import daggy, { TaggedConstructor, TaggedInstance } from "daggy";

type RPoint3D<T, K, V> = IPoint3D<T, K, V> & {x: T, y: K, z: V}
export interface IPoint3D<T, K, V> extends TaggedInstance<Point3D<T, K, V>> {
  scale(n: number): RPoint3D<T, K, V>;
}
export interface Point3D<T, K, V> extends TaggedConstructor<IPoint3D<T, K, V>>{
  (x: T, y: K, z: V): RPoint3D<T, K, V>
  prototype: {
    scale(this: RPoint3D<T, K, V>, n: number): RPoint3D<T, K, V>;
  }
}
