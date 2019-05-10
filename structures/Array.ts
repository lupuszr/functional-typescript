// interface HKT<H, T> {
//   T: T,
//   H: H,
// }

// interface Functor {
//   map: <I extends { T: any, H: any }>(this: I["H"], fn: (a: I["T"]) => I["T"]) => I["H"]
// }


// function L<T>() {

// class Cons {
//   head!: List_["T"];
//   tail!: List_["H"];
// }

// type Nil = "Nil" | undefined | null;

// type List_ = HKT<List, T>

// interface pina {
//   r: (a: any) => any
// }

// type List = Cons | Nil;

// class ListC implements Functor {
//   //(this: List_["H"], fn: (a: I["T"]) => I["T"]) => [I["H"], I["T"]];
//   // map!: (fn: (a: List_["T"]) => List_["T"]) => [List_["H"], List_["T"]];
//   // map: (fn) => {
//   //   return this;
//   // }
//   private a: List;
//   static Cons = function(a: Cons) {
//     return new ListC(a);
//   };
//   static Nil = function() {
//     return new ListC("Nil");
//   }
//   static of(a: List) {
//     new ListC(a)
//   }
//   constructor(a: List) {
//     this.a = a;
//   }
//   cata(this: ListC) {
//     return  this;
//   }
//   map(this: List_["H"], fn: (a: List_["T"]) => List_["T"]): List_["H"] {
//     return this;
//   }
// } 

// return ListC;
// // Array.prototype.ap = function (cfn) {
// //   return cfn.flatMap(fn => this.map(fn))
// // }
// }

// const Ln = L<number>();
// const a = Ln.Cons({ head: 3, tail: { head: 3, tail: "Nil" } }).cata();
// const jb = Ln.Nil()

// console.log(a);
