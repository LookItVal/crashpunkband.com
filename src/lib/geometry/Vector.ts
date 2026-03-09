export interface VectorLike {
  magnitude: number;
  angle: number;
}

/**
 * Represents a vector in 2D space with a magnitude and angle.
 * @immutable
 */
export class Vector {
  public readonly magnitude: number;
  public readonly angle: number;

  constructor({ magnitude, angle }: VectorLike) {
    this.magnitude = magnitude;
    this.angle = angle;
    Object.freeze(this);
  }

  /** 
  * Returns a new vector that has been rotated by the given angle in degrees.
  * @param angle - The angle in degrees to rotate the vector, where positive values rotate counterclockwise and negative values rotate clockwise.
  * @returns A new Vector that is the result of rotating this vector by the given angle.
  */
  public rotate(angle: number): Vector {
    return new Vector({ magnitude: this.magnitude, angle: (this.angle + angle) % 360 });
  }

  /**
   * Returns a new vector that has been scaled by the given factor.
   * @param factor - The factor to scale the magnitude of the vector by. A factor greater than 1 increases the magnitude, while a factor between 0 and 1 decreases it.
   * @returns A new Vector that is the result of scaling this vector by the given factor.
   */
  public scale(factor: number): Vector {
    return new Vector({ magnitude: this.magnitude * factor, angle: this.angle });
  }

  /**
   * Returns a new vector that is the result of adding this vector to another vector.
   * @param other - The other vector to add to this vector.
   * @returns A new Vector that is the result of adding this vector to the other vector.
   */
  public add(other: Vector): Vector {
    const x1 = this.magnitude * Math.cos((this.angle * Math.PI) / 180);
    const y1 = this.magnitude * Math.sin((this.angle * Math.PI) / 180);
    const x2 = other.magnitude * Math.cos((other.angle * Math.PI) / 180);
    const y2 = other.magnitude * Math.sin((other.angle * Math.PI) / 180);
    const x = x1 + x2;
    const y = y1 + y2;
    const magnitude = Math.sqrt(x * x + y * y);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    return new Vector({ magnitude, angle });
  }

  /**
   * Returns a new vector that is the result of applying random noise to the angle of this vector.
   * @param maxMagnitude - The maximum magnitude of the noise to apply to the angle, in degrees. The actual noise applied will be a random value between -maxMagnitude and maxMagnitude.
   * @returns A new Vector that is the result of applying random noise to the angle of this vector.
   */
  public applyAngularNoise(maxMagnitude: number): Vector {
    const noise = (Math.random() * 2 - 1) * maxMagnitude;
    return this.rotate(noise);
  }

  /**
   * Returns a new vector that is the result of applying random noise to the magnitude of this vector.
   * @param maxMagnitude - The maximum magnitude of the noise to apply to the magnitude. The actual noise applied will be a random value between -maxMagnitude and maxMagnitude.
   * @param allowNegative - Whether to allow the resulting magnitude to be negative. If false, the resulting magnitude will be clamped to a minimum of 0.
   * @returns A new Vector that is the result of applying random noise to the magnitude of this vector.
   */
  public applyMagnitudeNoise(maxMagnitude: number, allowNegative: boolean = false): Vector {
    if (allowNegative) {
      const noise = (Math.random() * 2 - 1) * maxMagnitude;
      let offsetVector;
      if (noise < 0) {
        offsetVector = new Vector({ magnitude: -noise, angle: (this.angle + 180) % 360 });
      } else {
        offsetVector = new Vector({ magnitude: noise, angle: this.angle });
      }
      return this.add(offsetVector);
    } else {
      const noise = Math.random() * maxMagnitude;
      const offsetVector = new Vector({ magnitude: noise, angle: this.angle });
      return this.add(offsetVector);
    }
  }
}