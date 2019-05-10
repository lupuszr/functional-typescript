import daggy, { TaggedSumInstance, TaggedSumConstructor } from "daggy";

export interface Step<A, B> extends TaggedSumInstance<Step<A, B>> {}
export interface CStep<A, B> extends TaggedSumConstructor<CStep<A, B>>{
  Done(b: B): Step<A, B>,
  Loop(a: A): Step<A, B>
}

const StepConstructor = function<A = any, B = any>(): CStep<A, B> {
  const Step: CStep<A, B> = daggy.taggedSum("Step", {
    Done: ['b'],
    Loop: ['a']
  })

  return Step;
}

export default StepConstructor;