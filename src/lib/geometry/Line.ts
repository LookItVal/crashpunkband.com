import { Point, PointLike } from "./Point";

export type LineOptions = {
  smoothness?: number;
  segments?: number | null;
  segmentLength?: number | null;
  preSegmentNoiseMagnitudes?: number;
  postSegmentNoiseMagnitudes?: number;
};

/**
 * Represents a line segment in 2D space defined by a start and end point, with optional noise applied to create a hand-drawn effect.
 * @immutable
 */
export class Line {
  /** The starting point of the line. */
  public readonly start: Point;
  /** The ending point of the line. */
  public readonly end: Point;
  /** The smoothness of the line, controlling the average distance of the bezier control points from the line. */
  private smoothness: number;
  /** The number of segments to divide the line into for applying noise. */
  private segments: number;
  /** The maximum magnitude of noise to apply to the start and end points of the line, before the segments are generated. */
  private preSegmentNoiseMagnitudes: number;
  /** The maximum magnitude of noise to apply to the points after the segments are generated. */
  private postSegmentNoiseMagnitudes: number;
  /** The start and end points after applying pre-segment noise. */
  private preSegmentPoints: Point[];
  /** All points along the line after segmenting and applying post-segment noise, used for calculating the SVG path. */
  private points: Point[];
  
  constructor(
    start: Point | PointLike,
    end: Point | PointLike,
    options: LineOptions = {}
  ) {
    this.start = start instanceof Point ? start : new Point(start);
    this.end = end instanceof Point ? end : new Point(end);
    const {
      smoothness = 0,
      segments = 0,
      segmentLength = null,
      preSegmentNoiseMagnitudes = 0,
      postSegmentNoiseMagnitudes = 0,
    } = options;

    if (smoothness < 0) {
      this.smoothness = 0;
    } else {
      this.smoothness = smoothness;
    }
    if (!!segments && !!segmentLength) {
      throw new Error("Cannot specify both segments and segmentLength");
    } else if (segments === null && !segmentLength) {
      throw new Error("Must specify either segments or segmentLength");
    } else if (!!segmentLength) {
      this.segments = Math.max(0, Math.floor(this.length / segmentLength!) - 1);
    } else if (!!segments && segments > 0) {
      this.segments = segments;
    } else {
      this.segments = 0;
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

  /** The length of the line segment, calculated from the start and end points. */
  public get length(): number {
    return Math.hypot(this.end.x - this.start.x, this.end.y - this.start.y);
  }
  
  /** The angle of the line segment in degrees, calculated from the start and end points. */
  public get angle(): number {
    return (Math.atan2(this.preSegmentPoints[1].y - this.preSegmentPoints[0].y, this.preSegmentPoints[1].x - this.preSegmentPoints[0].x) * 180) / Math.PI;
  }
  
  /** The SVG path data representing the line, including any applied noise. */
  public get pathData(): string {
    if (this.smoothness === 0) {
      let path = `M ${this.points[0].x} ${this.points[0].y}`;
      for (let i = 1; i < this.points.length; i++) {
        path += ` L ${this.points[i].x} ${this.points[i].y}`;
      }
      return path;
    } else {
      let path = `M ${this.points[0].x} ${this.points[0].y}`;
      path += ` C ${this.points[1].x} ${this.points[1].y}, ${this.points[2].x} ${this.points[2].y}, ${this.points[3].x} ${this.points[3].y}`;
      for (let i = 4; i < this.points.length; i += 2) {
        path += ` S ${this.points[i].x} ${this.points[i].y}, ${this.points[i + 1].x} ${this.points[i + 1].y}`;
      }
      return path;
    }
  }

  /** A method for generating the pre-segment noise points. */
  private applyPreSegmentNoise(): Point[] {
    return [this.start, this.end].map((point) => {return point.applyNoise(this.preSegmentNoiseMagnitudes)});
  }

  /** A method for generating the noisy segments of the line. */
  private generateNoisySegments(): Point[] {
    const segments: Point[] = [this.preSegmentPoints[0]];
    const segmentLength = this.length / (this.segments + 1);
    if (this.smoothness === 0) {
      for (let i = 1; i <= this.segments; i++) {
        segments.push(segments[i - 1].applyVector(this.angle, segmentLength));
      }
      segments.push(this.preSegmentPoints[1]);
      return segments.map((point) => {return point.applyNoise(this.postSegmentNoiseMagnitudes)});
    } else {
      const belzier_magnitude = (segmentLength/2) * this.smoothness;
      segments.push(this.preSegmentPoints[0].applyVector(this.angle, belzier_magnitude));
      let lastPoint = segments[0];
      for (let i = 1; i <= this.segments; i++) {
        const nextPoint = lastPoint.applyVector(this.angle, segmentLength);
        const controlPoint = nextPoint.applyVector(this.angle - 180, belzier_magnitude);
        segments.push(controlPoint);
        segments.push(nextPoint);
        lastPoint = nextPoint;
      }
      segments.push(this.preSegmentPoints[1].applyVector(this.angle - 180, belzier_magnitude));
      segments.push(this.preSegmentPoints[1]);
      return segments.map((point) => {return point.applyNoise(this.postSegmentNoiseMagnitudes)});
    }
  }
}