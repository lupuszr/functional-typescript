import daggy from "daggy";
import { Point3D } from "Point3D";

const Point3D: Point3D<number, number, number> = daggy.tagged('Point3D', ['x', 'y', 'z'])

const a = Point3D(1, 2, 3);
Point3D.is(a);
a.toString()

Point3D.prototype.scale = function(n: number) {
  return Point3D(this.x * n, this.y * n, this.z * n)
}

console.log(a.scale(3))

