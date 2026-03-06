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
  options?: LineOptions;
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

  public build(): ShapeDefinition {
    return {
      lines: this.lines
    };
  }
}
