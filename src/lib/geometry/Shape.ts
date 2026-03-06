import { LineOptions } from "./Line";
import { PointLike } from "./Point";

export type StrokeOptions = {
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "round" | "bevel" | "miter" | "inherit";
};

export type ShapeSegment = {
  start: PointLike;
  end: PointLike;
  count?: number;
  brush?: boolean;
  brushstrokeOptions?: {
    noiseMagnitude: number;
    brussleCount: number;
  };
  lineOptions?: LineOptions;
  strokeOptions?: StrokeOptions;
};

export type ShapeDefinition = {
  name?: string;
  lines: ShapeSegment[];
};

/**
 * Fluent builder for shape definitions that can be serialized and rendered later.
 */
export class ShapeBuilder {
  private lines: ShapeSegment[] = [];

  public addLine(
    start: PointLike,
    end: PointLike,
    config: Omit<ShapeSegment, "start" | "end"> = {}
  ): this {
    this.lines.push({ start, end, ...config });
    return this;
  }

  public makeAllBrushstrokes(): this {
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].brush = true;
    }
    return this;
  }

  public makeAllLines(): this {
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].brush = false;
    }
    return this;
  }

  public build(): ShapeDefinition {
    return {
      lines: this.lines
    };
  }
}
