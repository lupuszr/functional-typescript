import curry from "ramda.curry";
import daggy from "daggy";

const a = curry<(...args: any) => any>(daggy.tagged);
const b  = a("R", ["c", "d"]);
