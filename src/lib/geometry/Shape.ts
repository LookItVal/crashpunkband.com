import { LineOptions } from "./Line";
import { CircleOptions } from "./Circle";
import { PointLike, Point } from "./Point";

export type StrokeOptions = {
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "round" | "bevel" | "miter" | "inherit";
};

export type ShapeSegment = ShapeSegmentLine | ShapeSegmentCircle;

export type ShapeSegmentLine = {
  type: "line";
  start: Point;
  end: Point;
  count?: number;
  brush?: boolean;
  brushstrokeOptions?: {
    noiseMagnitude: number;
    brussleCount: number;
  };
  lineOptions?: LineOptions;
  strokeOptions?: StrokeOptions;
};

export type ShapeSegmentCircle = {
  type: "circle";
  center: Point;
  radius: number;
  count?: number;
  postNoiseMagnitude?: number;
  circleOptions?: CircleOptions;
  strokeOptions?: StrokeOptions;
};

export type ShapeDefinition = {
  name?: string;
  shapeSegments: ShapeSegment[];
};

/**
 * Fluent builder for shape definitions that can be serialized and rendered later.
 */
export class ShapeBuilder {
  private shapeSegments: ShapeSegment[] = [];

  public addLine(
    start: PointLike,
    end: PointLike,
    config: Omit<ShapeSegmentLine, "start" | "end" | "type"> = {}
  ): this {
    this.shapeSegments.push({ type: "line", start: new Point(start), end: new Point(end), ...config });
    return this;
  }

  public addCircle(
    center: PointLike,
    radius: number,
    config: Omit<ShapeSegmentCircle, "center" | "radius" | "type"> = {}
  ): this {
    this.shapeSegments.push({ type: "circle", center: new Point(center), radius, ...config });
    return this;
  }

  public makeAllBrushstrokes(): this {
    for (let i = 0; i < this.shapeSegments.length; i++) {
      if (this.shapeSegments[i].type === "line") {
        (this.shapeSegments[i] as ShapeSegmentLine).brush = true;
      }
    }
    return this;
  }

  public makeAllLines(): this {
    for (let i = 0; i < this.shapeSegments.length; i++) {
      if (this.shapeSegments[i].type === "line") {
        (this.shapeSegments[i] as ShapeSegmentLine).brush = false;
      }
    }
    return this;
  }

  public applyOptions(
    options: Partial<ShapeSegmentLine> | Partial<ShapeSegmentCircle>,
    filter: {
      segmentType?: "line" | "circle",
      index?: number,
      startIndex?: number,
      endIndex?: number
    } = {segmentType: "line"}): this {
    this.shapeSegments = this.shapeSegments.map((segment, i) => {
      if (filter.segmentType && segment.type !== filter.segmentType) return segment;
      if (filter.index !== undefined && i !== filter.index) return segment;
      if (filter.startIndex !== undefined && i < filter.startIndex) return segment;
      if (filter.endIndex !== undefined && i > filter.endIndex) return segment;
      if (segment.type === "line" && options.type === "line") {
        const lineOptions = {
          ...segment.lineOptions,
          ...options.lineOptions,
        };
        const brushstrokeOptions = {
          ...segment.brushstrokeOptions,
          ...options.brushstrokeOptions,
        };
        const strokeOptions = {
          ...segment.strokeOptions,
          ...options.strokeOptions,
        };
        return {
          ...segment,
          ...options,
          lineOptions: Object.keys(lineOptions).length ? lineOptions : undefined,
          brushstrokeOptions: Object.keys(brushstrokeOptions).length ? brushstrokeOptions : undefined,
          strokeOptions: Object.keys(strokeOptions).length ? strokeOptions : undefined,
        } as ShapeSegmentLine;
      } else if (segment.type === "circle" && options.type === "circle") {
        const circleOptions = {
          ...segment.circleOptions,
          ...options.circleOptions,
        };
        const strokeOptions = {
          ...segment.strokeOptions,
          ...options.strokeOptions,
        };
        return {
          ...segment,
          ...options,
          circleOptions: Object.keys(circleOptions).length ? circleOptions : undefined,
          strokeOptions: Object.keys(strokeOptions).length ? strokeOptions : undefined,
        } as ShapeSegmentCircle;
      }
      throw new Error("Segment type mismatch or options missing type");
    });
    return this;
  }

  public scale(factor: number): this {
    this.shapeSegments = this.shapeSegments.map(segment => {
      if (segment.type === "line") {
        return {
          ...(segment as ShapeSegmentLine),
          start: segment.start.scale(factor),
          end: segment.end.scale(factor),
        };
      } else if (segment.type === "circle") {
        return {
          ...(segment as ShapeSegmentCircle),
          center: segment.center.scale(factor),
          radius: segment.radius * factor,
        };
      }
      return segment;
    });
    return this;
  }

  public translate({x=0, y=0}: {x?: number, y?: number} = {}): this {
    this.shapeSegments = this.shapeSegments.map(segment => {
      if (segment.type === "line") {
        return {
          ...(segment as ShapeSegmentLine),
          start: segment.start.translate({x, y}),
          end: segment.end.translate({x, y}),
        };
      } else if (segment.type === "circle") {
        return {
          ...(segment as ShapeSegmentCircle),
          center: segment.center.translate({x, y}),
        };
      }
      return segment;
    });
    return this;
  }

  public build(): ShapeDefinition {
    return {
      shapeSegments: this.shapeSegments
    };
  }
}
