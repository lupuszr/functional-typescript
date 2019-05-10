import { Monoid } from "typeclasses/Monoid";

class StringS implements Monoid<StringS> {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  empty(): StringS {
    return new StringS('');
  }
  concat(other: StringS): StringS {
    console.log('fasz', 'this:' + this.value, 'other:' + other.value)
    return new StringS(this.value + other.value);
  }
}

export default StringS;