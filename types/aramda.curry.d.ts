/* eslint-disable fp/no-arguments */

// How to master advanced TypeScript patterns
// Learn how to create types for curry and Ramda

//////////////////////////////////////////////////////////////////////////////////////////
// UPDATES ///////////////////////////////////////////////////////////////////////////////

// ---------------------------------------------------------------------------------------
// 24 March 2019

// I added a bonus for `pipe` and `compose` to learn more about complex types.

// ---------------------------------------------------------------------------------------
// 5 March 2019

// I have done a few (minimal) updates to maintain compatibility with TS 3.4.
// What kind of updates? I you run this on TS 3.4, you should see an error:

// But before we start, let's make sure that you have a very basic understanding
// of what currying is. Currying is the process of transforming a function that
// takes multiple arguments into a series of functions that take one argument at
// a time. Well that's the theory.

// In this guide, I will first explain how to create TypeScript types that work
// with a standard curry implementation.  
// Then, we will evolve them into more advanced types that can allow curried
// functions to take 0 or more arguments.  
// And finally, we will be able to use "gaps" that abstract the fact that we are
// not capable or willing to provide an argument at a certain moment.  

// TL;DR: We will create types for "classic curry" & "advanced curry" (Ramda).

//////////////////////////////////////////////////////////////////////////////////////////
// TUPLE TYPES ///////////////////////////////////////////////////////////////////////////

// We extracted the parameter types from `fn00` thanks to the magic of
// `Parameters`. But it's not so magical when you recode it:
type Params<F extends (...args: any[]) => any> =
  F extends ((...args: infer A) => any)
  ? A
  : never


// Good, it works just as `Parameters` does. Don't be scared of `infer`, it is
// one of the most powerful keywords for building types. I will explain it in
// more detail right after we practiced some more:

// ---------------------------------------------------------------------------------------
// HEAD

// Earlier, we learnt that a "classic curried" function takes one argument at a
// time. And we also saw that we can extract the parameter types in the form of
// a tuple type, very convenient.  
// So `Head` takes a tuple type `T` and returns the first type that it contains.
// This way, we'll be able to know what argument type has to be taken at a time.
type Head<T extends any[]> =
  T extends [any, ...any[]]
  ? T[0]
  : never


// ---------------------------------------------------------------------------------------
// TAIL

// A "classic curried" function consumes arguments one by one. This means that
// when we consumed the `Head<Params<F>>`, we somehow need to move on to the
// next parameter that hasn't been consumed yet. This is the purpose of `Tail`,
// it conveniently removes the first entry that a tuple might contain.

// As of TypeScript 3.4, we cannot "simply" remove the first entry of a tuple.
// So, we are going to work around this problem by using one very valid trick:
type Tail<T extends any[]> =
  ((...t: T) => any) extends ((_: any, ...tail: infer TT) => any)
  ? TT
  : []

// Using function types, we were able to tell TypeScript to infer the tuple that
// we wanted. If you do not understand it yet, it is not a problem, this is just
// a warm-up, remember?


// ---------------------------------------------------------------------------------------
// HASTAIL

// A curried function will return a function until all of it's parameters have
// been consumed. This condition is reached when we called `Tail` enough times
// that there is no tail left, nothing's left to consume:
type HasTail<T extends any[]> =
  T extends ([] | [any])
  ? false
  : true


// ---------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////
// IMPORTANT KEYWORDS ////////////////////////////////////////////////////////////////////

// You have encountered three important keywords: `type`, `extends` and `infer`.
// They can be pretty confusing for beginners, these are the ideas they convey:
//
// - `extends`:   
//   To keep it simple, you are allowed to think of it as if it was our dear old
//   JavaScript's `===`. When you do so, you can see an `extends` statement as a
//   simple ternary, and then it becomes much simpler to understand. In this
//   case, `extends` is referred to as a conditional type.  
//
// - `type`:  
//   I like to think of a type as if it was a function, but for types. It has an
//   input, which are types (called generics) and has an output. The output
//   depends on the "logic" of a type, and `extends` is that block of logic,
//   similar to an `if` clause (or ternary).
//
// - `infer`:  
//   It is the magnifying glass of TypeScript, a beautiful inspecting tool that
//   can extract types that are trapped inside different kinds of structures!

// I think that you understand both `extends` & `type` well and this is why we
// are going to practice a bit more with `infer`. We're going to extract types
// that are contained inside of different generic types. This is how you do it:

// ---------------------------------------------------------------------------------------
// Extract a property's type from an object

type ObjectInfer<O> =
  O extends { a: infer A }
  ? A             // If true
  : never         // If false

// ---------------------------------------------------------------------------------------
// Extract inner types from function types

type FunctionInfer<F> =
  F extends (...args: infer A) => infer R
  ? [A, R]        // If true
  : never         // If false



// ---------------------------------------------------------------------------------------
// Extract generic types from a class or an interface

type ClassInfer<I> =
  I extends Promise<infer G>
  ? G
  : never


// ---------------------------------------------------------------------------------------
// Extract types from an array

type ArrayInfer<T> =
  T extends (infer U)[]
  ? U
  : never


// ---------------------------------------------------------------------------------------
// Extract types from a tuple

type TupleInfer<T> =
  T extends [infer A, ...(infer B)[]]
  ? [A, B]
  : never



// There, we made use of a constrained generic called `T` that is going to track
// any taken arguments. But now, it is completely broken, there is no more type
// checks because we said that we wanted to track `any[]` kind of parameters
// (the constraint). But not only, `Tail` is completely useless because it only
// worked well when we took one argument at a time. 

// There is only one solution: some more tools 🔧.

//////////////////////////////////////////////////////////////////////////////////////////
// RECURSIVE TYPES ///////////////////////////////////////////////////////////////////////

// The following tools are going to be used to determine the next parameters to
// be consumed. How? By tracking the consumed parameters with `T` we should be
// able to guess what's left.

// Fasten your seat belt! You are about to learn another powerful technique 🚀:

// ---------------------------------------------------------------------------------------
// LAST

// Take your time to try to understand this complex yet very short type. This
// example takes a tuple as a parameter and it extracts its last entry out:
type Last<T extends any[]> = {
  0: Last<Tail<T>>
  1: Head<T>
}[
  HasTail<T> extends true
  ? 0
  : 1
]


// ---------------------------------------------------------------------------------------

// This example demonstrates the power of conditional types when used as an
// indexed type's accessor. A what? A conditional type that accesses a type's
// inner types in a command line fashion. For a more visual explanation:

// A Type<X, Y, ...> {      Conditional Accessor  
// +---+------------+       +------------------+  
// | 0 | Inner Type |       | X extends number |   
// +----------------+       | ? 1              |  
// | 1 | Inner Type |       | : Y extends ...  |  
// +----------------+       |   ? 0            |  
// | 2 | Inner Type |       |   : 2            |  
// +----------------+       |                  |  
// |...|    ...     |       | ...              |  
// +----------------+       +------------------+  
// }[Conditional Accessor]  ( 0 | 1 | 2 | ... )  

// This technique is an ideal approach and a safe way to do recursion like we
// just did. But it is not only limited to recursion, it is a nice and a visual
// way to organise complex conditional types.

//////////////////////////////////////////////////////////////////////////////////////////
// BASIC TOOLS #1 ////////////////////////////////////////////////////////////////////////

// Where were we? We said that we needed tools in order to track arguments. It
// means that we need to know what parameter types we can take, which ones have
// been consumed and which ones are the next to come. Let's get started:

// ---------------------------------------------------------------------------------------
// LENGTH

// To do the analysis mentioned above, we will need to iterate over tuples. As
// of TypeScript 3.4.x, there is no such iteration protocol that could allow us
// to iterate freely (like a `for`). Mapped types can map from a type to
// another, but they are too limiting for what we want to do. So, ideally, we
// would like to be able to manipulate some sort of counter:
type Length<T extends any[]> =
  T['length']


// ---------------------------------------------------------------------------------------
// PREPEND

// It adds a type `E` at the top of a tuple `T` by using our first TS trick:
type Prepend<E, T extends any[]> =
  ((head: E, ...args: T) => any) extends ((...args: infer U) => any)
  ? U
  : T


// ---------------------------------------------------------------------------------------
// DROP

// It takes a tuple `T` and drops the first `N` entries. To do so we are going
// to use the same techniques we used in `Last` and our brand new counter type:
type Drop<N extends number, T extends any[], I extends any[]=[]> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>
  1: T
}[
  Length<I> extends N
  ? 1
  : 0
]


// What happened?  

// The `Drop` type will recurse until `Length<I>` matches the value of `N` that
// we passed. In other words, the type of index `0` is chosen by the conditional
// accessor until that condition is met. And we used `Prepend<any, I>` so that
// we can increase a counter like we would do in a loop. Thus, `Length<I>` is
// used as a recursion counter, and it is a way to freely iterate with TS.

//////////////////////////////////////////////////////////////////////////////////////////
// CURRY V3 //////////////////////////////////////////////////////////////////////////////

// It's been long and tough to get here, well done! There's a reward for you 🥇
// Now, let's say that we tracked that 2 parameters were consumed by our curry:
type parameters = [string, number, boolean, string[]]
type consumed = [string, number]

// Because we know the amount of consumed parameters, we can guess the ones that
// are still left to be consumed. Thanks to the help of `Drop`, we can do this:
type toConsume = Drop<Length<consumed>, parameters> // [boolean, string[]]


//////////////////////////////////////////////////////////////////////////////////////////
// CURRY V4 //////////////////////////////////////////////////////////////////////////////

// But we've got another error above, TS complains that our `Drop` is not of
// type `any[]`. Sometimes, TS will complain that a type is not the one you
// expected, but you know it is! So let's add another tool to the collection:

// ---------------------------------------------------------------------------------------
// CAST

// It requires TS to re-check a type `X` against a type `Y`, and type `Y` will
// only be enforced if it fails. This way, we're able to stop TS's complaints:
type Cast<X, Y> = X extends Y ? X : Y


// Everything works like a charm 🌹. You just got yourself a smart, generic,
// variadic curry type. You will be able play with it very soon... But before
// you do so, what if I told you that our type can get even more awesome?

//////////////////////////////////////////////////////////////////////////////////////////
// PLACEHOLDERS //////////////////////////////////////////////////////////////////////////

// How awesome? We are going give our type the ability to understand partial
// application of any combination of arguments, on any position. According to
// Ramda's documentation, we can do so by using a placeholder called `_`. It
// states that for any curried function `f`, these calls are equivalent:  
// f(1, 2, 3)  
// f(_, 2, 3)(1)  
// f(_, _, 3)(1)(2)  
// f(_, 2, _)(1, 3)  
// f(_, 2)(1)(3)  
// f(_, 2)(1, 3)  
// f(_, 2)(_, 3)(1)  

// A placeholder or "gap" is an object that abstracts the fact that we are not
// capable or willing to provide an argument at a certain moment. Let's start by
// defining what a placeholder is. We can directly grab the one from Ramda:


type __ = any

// Earlier, we have learnt how to do our first type iterations by increasing a
// tuple's length. In fact, it is a bit confusing to use `Length` and `Prepend`
// on our counter type. And to make it clearer, we will refer to that counter as
// an iterator from now on. Here's some new aliases just for this purpose:

// ---------------------------------------------------------------------------------------
// POS (Position)

// Use it to query the position of an iterator:
type Pos<I extends any[]> =
  Length<I>

// ---------------------------------------------------------------------------------------
// NEXT (+1)

// It brings the position of an iterator up:
type Next<I extends any[]> =
  Prepend<any, I>

// ---------------------------------------------------------------------------------------
// PREV (-1)

// It brings the position of an iterator down:
type Prev<I extends any[]> =
  Tail<I>

// ---------------------------------------------------------------------------------------

// Let's test them:
type iterator = [any, any]          // 2 items
type test50 = Pos<iterator>       // 2
type test51 = Pos<Next<iterator>> // 3
type test52 = Pos<Prev<iterator>> // 1

// ---------------------------------------------------------------------------------------
// Iterator

// It creates an iterator (our counter type) at a position defined by `Index`
// and is able to start off from another iterator's position by using `From`:
type Iterator<Index extends number = 0, From extends any[]=[], I extends any[]=[]> = {
  0: Iterator<Index, Next<From>, Next<I>>
  1: From
}[
  Pos<I> extends Index
  ? 1
  : 0
]

// Let's test it:
type test53 = Iterator<2>         // [any, any]
type test54 = Iterator<3, test53> // [any, any, any, any, any]
type test55 = Pos<test53>         // 2
type test56 = Pos<test54>         // 5

// ---------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////
// BASIC TOOLS #2 ////////////////////////////////////////////////////////////////////////

// Good, so what do we do next? We need to analyze whenever a placeholder is
// passed as an argument. From there, we will be able to tell if an parameter
// has been "skipped" or "postponed". Here's some more tools for this purpose:

// ---------------------------------------------------------------------------------------
// REVERSE

// Believe it or not, we still lack a few basic tools. `Reverse` is going to
// give us the freedom that we needed. It takes a tuple `T` and turns it the
// other way around into a tuple `R`, thanks to our brand new iteration types:
type Reverse<T extends any[], R extends any[]=[], I extends any[]=[]> = {
  0: Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>
  1: R
}[
  Pos<I> extends Length<T>
  ? 1
  : 0
]

// Let's test it:
type test57 = Reverse<[1, 2, 3]>      // [3, 2, 1]
type test58 = Reverse<test57>         // [1, 2, 3]
type test59 = Reverse<[2, 1], [3, 4]> // [1, 2, 3, 4]

// ---------------------------------------------------------------------------------------
// CONCAT

// And from `Reverse`, `Concat` was born. It simply takes a tuple `T1` and
// merges it with another tuple `T2`. It's kind of what we did in `test59`:
type Concat<T1 extends any[], T2 extends any[]> =
  Reverse<Reverse<T1> extends infer R ? Cast<R, any[]> : never, T2>

// Let's test it:
type test60 = Concat<[1, 2], [3, 4]> // [1, 2, 3, 4]

// ---------------------------------------------------------------------------------------
// APPEND

// Enabled by `Concat`, `Append` can add a type `E` at the end of a tuple `T`:
type Append<E, T extends any[]> =
  Concat<T, [E]>

//////////////////////////////////////////////////////////////////////////////////////////
// GAP ANALYSIS //////////////////////////////////////////////////////////////////////////

// We now have enough tools to perform complex type checks. But it's been a
// while since we discussed this "gap" feature, how does it work again? When a
// gap is specified as an argument, it's matching parameter is carried over to
// the next step (to be taken). So let's define types that understand gaps:

// ---------------------------------------------------------------------------------------
// GAPOF

// It checks for a placeholder in a tuple `T1` at the position described by an
// iterator `I`. If it is found, the matching type is collected at the same
// position in `T2` and carried over (saved) for the next step through `TN`:
type GapOf<T1 extends any[], T2 extends any[], TN extends any[], I extends any[]> =
  T1[Pos<I>] extends __
  ? Append<T2[Pos<I>], TN>
  : TN



// Don't be impressed by this one, it calls `Gap` over `T1` & `T2` and stores
// the results in `TN`. And when it's done, it concats the results from `TN` to
// the parameter types that are left to be taken (for the next function call):
type GapsOf<T1 extends any[], T2 extends any[], TN extends any[]=[], I extends any[]=[]> = {
  0: GapsOf<T1, T2, GapOf<T1, T2, TN, I> extends infer G ? Cast<G, any[]> : never, Next<I>>
  1: Concat<TN, Drop<Pos<I>, T2> extends infer D ? Cast<D, any[]> : never>
}[
  Pos<I> extends Length<T1>
  ? 1
  : 0
]
// This last piece of the puzzle is to be applied to the tracked parameters `T`.
// We will make use of mapped types to explain that is is possible replace any
// argument with a placeholder:
type PartialGaps<T extends any[]> = {
  [K in keyof T]?: T[K] | __
}

type CleanedGaps<T extends any[]> = {
  [K in keyof T]: NonNullable<T[K]>
}

// So let's put the two together and get what we wanted:
type Gaps<T extends any[]> = CleanedGaps<PartialGaps<T>>

// This is very cute, but we have one last problem to solve: parameter hints. I
// don't know for you, but I use parameter hints a lot. It is very useful to
// know the names of the parameters that you're dealing with. The version above
// does not allow for these kind of hints. Here is the fix:  
type Curry<F extends ((...args: any) => any)> =
  <T extends any[]>(...args: Cast<Cast<T, Gaps<Parameters<F>>>, any[]>) =>
    GapsOf<T, Parameters<F>> extends [any, ...any[]]
    ? Curry<(...args: GapsOf<T, Parameters<F>> extends infer G ? Cast<G, any[]> : never) => ReturnType<F>>
    : ReturnType<F>

declare function curry<F extends (...args: any) => any>(f: F): Curry<F>

// There's just one thing, when using gaps, we'll lose the name of a parameter.

// A word for IntelliJ users only: You won't be able to benefit from proper
// hints. I recommend that you switch to Visual Studio Code as soon as possible
// (it was brought by Microsoft after all). And it is community-driven, free,
// much (much) faster, and supports key bindings for IntelliJ users.

//////////////////////////////////////////////////////////////////////////////////////////
// LAST WORDS ////////////////////////////////////////////////////////////////////////////

// Finally, I would like to inform you that there is a current proposal for
// variadic types https://github.com/Microsoft/TypeScript/issues/5453. What
// you've learned here is not going to become obsolete, this proposal aims to
// ease the most common tuple type manipulations, so it is a very good thing for
// us. In a close future, it will enable easier tuple concatenations like the
// `Append`, `Concat`, and `Prepend` we've built, as well as destructuring, and a
// better way to describe variable function parameters.

// That's it. I know that it's a lot to digest at once so that's why I released
// a developer version of this article. You can clone it, test it and change it
// with TypeScript 3.3.x and above. Keep it close to you and learn from it until
// you become more comfortable with the different techniques 📖.
// https://github.com/pirix-gh/medium/blob/master/src/types-curry-ramda/index.ts

//////////////////////////////////////////////////////////////////////////////////////////

// High-five 👏 if you enjoyed this guide, and stay tuned for my next article!

// Thanks for reading. And if you have any questions or remarks, you are more
// than welcome to leave a comment.

//////////////////////////////////////////////////////////////////////////////////////////


export = curry;

