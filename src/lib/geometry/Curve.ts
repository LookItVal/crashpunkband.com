import { Point, PointLike } from "./Point";
import { Vector, VectorLike } from "./Vector";

export type CurveOptions = {
  segments?: number;
  preSegmentNoiseMagnitudes?: number;
  postSegmentNoiseMagnitudes?: number;
};

export class Curve {
  /** The starting point of the curve. */
  public readonly startPoint: Point;
  /** The starting vector of the curve, representing the initial direction and magnitude of the curve. */
  public readonly startVector: Vector;
  /** The ending point of the curve. */
  public readonly endPoint: Point;
  /** The ending vector of the curve, representing the final direction and magnitude of the curve. */
  public readonly endVector: Vector;
  /** The number of segments to divide the curve into for applying noise. */
  private segments: number;
  /** The maximum magnitude of noise to apply to the points before the segments are generated. */
  private preSegmentNoiseMagnitudes: number;
  /** The maximum magnitude of noise to apply to the points after the segments are generated. */
  private postSegmentNoiseMagnitudes: number;
  /** The points along the curve after applying pre-segment noise */
  private preSegmentPoints: Point[];
  /** All points along the curve after segmenting and applying post-segment noise, used for calculating the SVG path. */
  private points: Point[];

  constructor(
    startPoint: Point | PointLike,
    startVector: Vector | VectorLike,
    endPoint: Point | PointLike,
    endVector: Vector | VectorLike,
    options: CurveOptions = {}
  ) {
    this.startPoint = startPoint instanceof Point ? startPoint : new Point(startPoint);
    this.startVector = startVector instanceof Vector ? startVector : new Vector(startVector);
    this.endPoint = endPoint instanceof Point ? endPoint : new Point(endPoint);
    this.endVector = endVector instanceof Vector ? endVector : new Vector(endVector);
    const {
      segments = 0,
      preSegmentNoiseMagnitudes = 0,
      postSegmentNoiseMagnitudes = 0,
    } = options;
    if (segments < 0) {
      this.segments = 0;
    } else {
      this.segments = segments;
    }
    if (preSegmentNoiseMagnitudes < 0) {
      this.preSegmentNoiseMagnitudes = 0;
    } else {
      this.preSegmentNoiseMagnitudes = preSegmentNoiseMagnitudes;
    }
    if (postSegmentNoiseMagnitudes < 0) {
      this.postSegmentNoiseMagnitudes = 0;
    } else {
      this.postSegmentNoiseMagnitudes = postSegmentNoiseMagnitudes;
    }
    this.preSegmentPoints = this.applyPreSegmentNoise();
    this.points = this.generateNoisySegments();
    Object.freeze(this);
  }

  public get pathData(): string {
    let path = `M ${this.points[0].x} ${this.points[0].y} `;
    path += ` C ${this.points[1].x} ${this.points[1].y}, ${this.points[2].x} ${this.points[2].y}, ${this.points[3].x} ${this.points[3].y}`;
    for (let i = 4; i < this.points.length; i += 2) {
      path += ` S ${this.points[i].x} ${this.points[i].y}, ${this.points[i + 1].x} ${this.points[i + 1].y}`;
    }
    return path;
  }

  /** Applies pre-segment noise to the curve's points and returns the resulting points. */
  private applyPreSegmentNoise(): Point[] {
    return [
      this.startPoint.applyNoise(this.preSegmentNoiseMagnitudes),
      this.startPoint.applyVector(this.startVector.angle, this.startVector.magnitude).applyNoise(this.preSegmentNoiseMagnitudes),
      this.endPoint.applyVector(this.endVector.angle, this.endVector.magnitude).applyNoise(this.preSegmentNoiseMagnitudes),
      this.endPoint.applyNoise(this.preSegmentNoiseMagnitudes),
    ];
  }

  /**
   * Splits a sinlge curve segment into 2 segments using De Casteljau's algorithm
   * 
   * @param points - An array of 4 points representing the start point, start control point, end control point, and end point of the curve segment to split.
   * @param t - The parameter between 0 and 1 at which to split the curve segment, where 0 corresponds to the start point and 1 corresponds to the end point.
   * @returns An array of 7 points representing the start point, first control point, second control point, split point, third control point, fourth control point, and end point of the resulting two curve segments after splitting.
   */
  private deCasteljau(points: Point[], t: number): Point[] {
    const lerp = (p1: Point, p2: Point, t: number): Point => {
      return new Point({
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
      });
    }
    const [p0, p1, p2, p3] = points;
    const p01 = lerp(p0, p1, t);
    const p12 = lerp(p1, p2, t);
    const p23 = lerp(p2, p3, t);
    const p012 = lerp(p01, p12, t);
    const p123 = lerp(p12, p23, t);
    const p0123 = lerp(p012, p123, t);
    return [p0, p01, p012, p0123, p123, p23, p3];
  }

  /** Generates the points along the curve after applying pre-segment noise and segmenting the curve, then applies post-segment noise to those points and returns the resulting points. */
  private generateNoisySegments(): Point[] {
    const points: Point[] = [];
    if (this.segments <= 1) {
      points.push(...this.preSegmentPoints);
      return points.map((point) => {return point.applyNoise(this.postSegmentNoiseMagnitudes)});
    }
    
    let remainingCurve = [...this.preSegmentPoints];
    let consumedT = 0;
    for (let i = 1; i <= this.segments; i++) {
      const globalT = i / (this.segments + 1);
      const localT = (globalT - consumedT) / (1 - consumedT);
      const [p0, p1, p2, p3, p4, p5, p6] = this.deCasteljau(remainingCurve, localT);
      if (i === 1) {
        points.push(p0, p1);
      }
      points.push(p2, p3);
      remainingCurve = [p3, p4, p5, p6];
      consumedT = globalT;
    }
    points.push(remainingCurve[2], remainingCurve[3]);
    return points.map((point) => {return point.applyNoise(this.postSegmentNoiseMagnitudes)});
  }
}