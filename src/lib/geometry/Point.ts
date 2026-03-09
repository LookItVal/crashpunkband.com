/**
 * An object with x and y properties representing a point in 2D space.
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */
export interface PointLike {
  x: number;
  y: number;
}

/**
 * Represents a point in 2D space with x and y coordinates.
 * @immutable
 */
export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor({x, y}: PointLike) {
    this.x = x;
    this.y = y;
    Object.freeze(this);
  }

  /**
   * Returns a new Point that is the result of applying a vector with the given angle and magnitude to this point.
   * 
   * @param angle - The angle of the vector in degrees.
   * @param magnitude - The magnitude of the vector.
   * @returns A new Point after applying the vector.
   */
  public applyVector(angle: number, magnitude: number): Point {
    const radians = (angle * Math.PI) / 180;
    return new Point({ x: this.x + Math.cos(radians) * magnitude, y: this.y + Math.sin(radians) * magnitude });
  }

  /**
   * Returns a new Point that is the result of applying random noise to this point.
   * 
   * @param maxMagnitude - The maximum magnitude of the noise.
   * @returns A new Point after applying the noise.
   */
  public applyNoise(maxMagnitude: number): Point {
    const angle = Math.random() * 360;
    const magnitude = Math.random() * maxMagnitude;
    return this.applyVector(angle, magnitude);
  }

  /**
   * Returns a new Point that is the result of translating this point by the given x and y offsets.
   * 
   * @param x - The amount to translate in the x direction.
   * @param y - The amount to translate in the y direction.
   * @returns A new Point after applying the translation.
   */
  public translate({x=0, y=0}: {x?: number; y?: number}): Point {
    return new Point({ x: this.x + x, y: this.y + y });
  }

  /**
   * Returns a new Point that is the result of scaling this point by the given factor.
   * 
   * @param factor - The factor to scale the point by.
   * @returns A new Point after applying the scaling.
   */
  public scale(factor: number): Point {
    return new Point({ x: this.x * factor, y: this.y * factor });
  }
}