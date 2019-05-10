export interface Tagged {
  toString() : string;
}
export interface TaggedInstance<T> extends Tagged{
  cata(a: Options<T>): never;
}
export interface TaggedConstructor<T> extends Tagged{
  is(a: T): boolean;
  from(): T;
  "@@type": String;
}

export interface TaggedSum {
  toString(): string;
}
type Options<T> = { [K: string]: (...a: any) => any };
export interface TaggedSumInstance<T> extends TaggedSum{
  cata(a: Options<T>): any;
}
export interface TaggedSumConstructor<T> extends TaggedSum{
  is(a: T): boolean;
  from(): T;
  "@@type": String;
  "@@tags": Array<String>
}


export function tagged(typeName: string, fields: any): any;
export function taggedSum(typeName: string, constructors: any): any;
