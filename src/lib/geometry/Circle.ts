import { Point, PointLike } from "./Point";

export type CircleOptions = {
  rotation: number;
  overhangAngle: number;
  overhangAngleNoise: number;
  segments: number;
  segmentNoiseMagnitudes: number;
};


export class Circle {
  public readonly center: Point
  public readonly radius: number;
  private rotation: number;
  private overhangAngle: number;
  private overhangAngleNoise: number;
  private segments: number;
  private segmentNoiseMagnitudes: number;
  private points: Point[];

  constructor(
    center: Point | PointLike,
    radius: number,
    options: CircleOptions = {
      rotation: 90,
      overhangAngle: 0,
      overhangAngleNoise: 0,
      segments: 4,
      segmentNoiseMagnitudes: 0,
    }
  ) {
    this.center = new Point(center);
    this.radius = radius;
    this.rotation = options.rotation;
    this.overhangAngle = options.overhangAngle;
    this.overhangAngleNoise = options.overhangAngleNoise;
    this.segments = options.segments;
    this.segmentNoiseMagnitudes = options.segmentNoiseMagnitudes;
    this.points = this.calculatePoints();
  }

  private calculatePoints(): Point[] {
    const points: Point[] = [];
    const totalAngle = 360 + this.overhangAngle + (this.overhangAngleNoise * Math.random());
    const originalCircumference = 2 * Math.PI;
    const adjustedCircumference = originalCircumference * (totalAngle / 360);
    const sizingFactor = adjustedCircumference / originalCircumference;

    const angleStep = totalAngle / this.segments;
    const belzierControlPointDistance = (4 / 3) * Math.tan((Math.PI/2)*(sizingFactor/this.segments));

    points.push(new Point({
      x: Math.cos((this.rotation * Math.PI) / 180),
      y: Math.sin((this.rotation * Math.PI) / 180)
    }));
    points.push(points[0].applyVector(this.rotation + 90, belzierControlPointDistance));

    for (let i = 1; i <= this.segments; i++) {
      const angle = this.rotation + (i * angleStep);
      const radianAngle = (angle * Math.PI) / 180;
      const point = new Point({
        x: Math.cos(radianAngle),
        y: Math.sin(radianAngle)
      });
      points.push(point.applyVector(angle - 90, belzierControlPointDistance));
      points.push(point);
    }

    this.points = points.map(point => point.scale(this.radius).translate(this.center));
    this.points = this.points.map(point => point.applyNoise(this.segmentNoiseMagnitudes));
    return this.points;
  }

  public duplicateWithNoise(noiseFactor: number): Circle {
    const circle = new Circle(this.center, this.radius, {
      rotation: this.rotation,
      overhangAngle: this.overhangAngle,
      overhangAngleNoise: this.overhangAngleNoise,
      segments: this.segments,
      segmentNoiseMagnitudes: this.segmentNoiseMagnitudes,
    });
    circle.points = this.points.map(point => point.applyNoise(noiseFactor));
    return circle;
  }

  public get pathData(): string {
    let path = `M ${this.points[0].x} ${this.points[0].y}`;
    path += ` C ${this.points[1].x} ${this.points[1].y}, ${this.points[2].x} ${this.points[2].y}, ${this.points[3].x} ${this.points[3].y}`;
    for (let i = 4; i < this.points.length; i += 2) {
      path += ` S ${this.points[i].x} ${this.points[i].y}, ${this.points[i + 1].x} ${this.points[i + 1].y}`;
    }
    return path;
  }
}