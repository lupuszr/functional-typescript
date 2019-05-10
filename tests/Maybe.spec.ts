import MaybeConstructor, { Maybe } from "../structures/Maybe";

const MaybeN = MaybeConstructor<number>();
const Maybe = MaybeConstructor()
const MaybeFn = MaybeConstructor<(a: number) => number>();

type ApT = [Maybe<number>, Maybe<(a: number) => number>];

describe('Maybe', () => {
  describe('Maybe Setoid laws, **equals**', () => {
    test('reflexivity', () => {
      const value = 10;
      const res = MaybeN.of(value).equals(MaybeN.of(value));
      expect(res).toBeTruthy();
    })

    test('symmetry', () => {
      const a = 10;
      const b = 10;
      const res = MaybeN.of(a).equals(MaybeN.of(b)) === MaybeN.of(b).equals(MaybeN.of(a))
      expect(res).toBeTruthy();
    })

    test('transitivity', () => {
      const a = 10;
      const b = 10;
      const c = 10;
      const res = MaybeN.of(a).equals(MaybeN.of(b)) && MaybeN.of(b).equals(MaybeN.of(c)) && MaybeN.of(a).equals(MaybeN.of(c));
      expect(res).toBeTruthy();
    })
  })

  describe("Functor laws, **map**", () => {
    test("identity", () => {
      const value = 10;
      const res = MaybeN.of(value).map(a => a).equals(MaybeN.of(value))
      expect(res).toBeTruthy();
    })

    test('composition', () => {
      const value = 10;
      const f = (a: number) => a + 1;
      const g = (b: number) => b * 2;
      const ls = MaybeN.of(value).map(x => f(g(x)));
      const rs = MaybeN.of(value).map(g).map(f);
      const res = ls.equals(rs);
      expect(res).toBeTruthy();
    })
  });

  
  describe('Apply laws **ap**', () => {
    xtest('composition', () => {
      const value = 10;
      const fn = (a: number) => a;
      const v = MaybeN.of(10);
      const u = MaybeN.of(20);
      const a = MaybeN.of(30);

      //const res = v.ap(u.ap(a.map(f => g => x => f(g(x)))))
    })    
  })

  describe('Applicative laws **ap, of**', () => {
    test('identity', () => {
      const value = 10;
      const id = (a: number) => a;

      const res = MaybeN.of(value).ap<ApT[0], ApT[1]>(MaybeFn.of(id)).equals(MaybeN.of(value))
      
      expect(res).toBeTruthy();
    })

    test('homomorphism', () => {
      const value = 10;
      const fn = (a: number) => a + 10;
      
      const ls = MaybeN.of(value).ap<ApT[0], ApT[1]>(MaybeFn.of(fn));
      const rs = MaybeN.of(fn(value));
      const res = ls.equals(rs);

      expect(res).toBeTruthy();
    })
    
    test('interchange', () => {
      const value = 10;
      const fn = MaybeFn.Just((a: number) => a * 10);
      
      type FnT = (a: number) => number;
      
      const ls = MaybeN.of(value).ap<ApT[0], ApT[1]>(fn);
      const rs = fn.ap<ApT[0], ApT[0]>(MaybeN.of((f: FnT) => f(value)))

      expect(ls.equals(rs)).toBeTruthy();
    })
  })

  describe('Alt laws, **alt**', () => {
    test('associativity', () => {
      const value = 10;

      const a = MaybeN.Nothing;
      const b = MaybeN.Just(value);
      const c = MaybeN.Nothing;

      const ls = a.alt(b).alt(c)
      const rs = a.alt(b.alt(c));

      expect(ls.equals(rs)).toBeTruthy();
    })

    test('distributivity', () => {
      const value = 10;

      const a = MaybeN.Nothing;
      const b = MaybeN.Just(value);
      const f = (a: number) => a;

      const ls = a.alt(b).map(f);
      const rs = a.map(f).alt(b.map(f));

      expect(ls.equals(rs)).toBeTruthy();
    })
    
  })
  
  describe('Foldable laws, **reduce**', () => {
    
  })

  describe('Chain laws, **chain**', () => {
    test('associativity', () => {
      const m = MaybeN.Just(1);
      const f = (a: number) => Maybe.Just(a * 2);
      const g = (a: number) => Maybe.Just(`${a + 5}`);

      const ls = m.chain<Maybe<number>>(f).chain<Maybe<string>>(g);
      const rs = m.chain<Maybe<string>>(x => f(x).chain(g));

      expect(ls.equals(rs)).toBeTruthy();
    })
    
  })
  describe('Monad laws, **of, chain**', () => {
    test('left identity', () => {
      const value = 10;
      const f = (a: number) => Maybe.Just(a * 5);

      const ls = Maybe.of(value).chain<Maybe<number>>(f)
      const rs: Maybe<number> = f(value);

      expect(ls.equals(rs)).toBeTruthy();
    })

    test('right identity', () => {
      const value = 10;
      const m = Maybe.Just(value);

      const ls = m.chain<Maybe<any>>(Maybe.of);
      const rs = m;

      expect(ls.equals(rs)).toBeTruthy();
    })
  })
  
})
