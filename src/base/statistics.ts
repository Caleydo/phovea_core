/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 29.08.2014.
 */

import {IIterable} from './IIterable';

/**
 * simple number statistics similar to DoubleStatistics in Caleydo
 * TODO use a standard library for that
 */
export interface IStatistics {
  readonly min: number;
  readonly max: number;
  readonly sum: number;
  readonly mean: number;
  readonly var: number;
  readonly sd: number;
  readonly n: number;
  readonly nans: number;
  readonly moment2: number;
  readonly moment3: number;
  readonly moment4: number;
  readonly kurtosis: number;
  readonly skewness: number;
}

export interface IAdvancedStatistics extends IStatistics {
  readonly median: number;
  readonly q1: number;
  readonly q3: number;
}

export class Statistics implements IStatistics {
  min: number = NaN;
  max: number = NaN;
  sum: number = 0;
  mean: number = 0;
  private _var: number = 0;
  n: number = 0;
  nans: number = 0;
  moment2: number = NaN;
  moment3: number = NaN;
  moment4: number = NaN;

  get var() {
    return this.n > 1 ? this._var / (this.n - 1) : 0;
  }

  /** Returns the standard deviation */
  get sd() {
    return Math.sqrt(this.var);
  }

  get kurtosis() {
    if (this.n === 0) {
      return 0;
    }
    return (this.n * this.moment4) / (this.moment2 * this.moment2) - 3;
  }

  get skewness() {
    if (this.n === 0) {
      return 0;
    }
    return Math.sqrt(this.n) * this.moment3 / (Math.pow(this.moment2, 3. / 2.));
  }

  push(x: number) {
    if (typeof x !== 'number') {
      x = Number.NaN;
    }

    if (isNaN(x)) {
      this.nans++;
      return;
    }

    this.n++;
    this.sum += x;
    if (x < this.min || isNaN(this.min)) {
      this.min = x;
    }
    if (this.max < x || isNaN(this.max)) {
      this.max = x;
    }
    // http://www.johndcook.com/standard_deviation.html
    // See Knuth TAOCP vol 2, 3rd edition, page 232
    // http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Higher-order_statistics

    if (this.n === 1) {
      this.mean = x;
      this._var = 0;
      this.moment2 = this.moment3 = this.moment4 = 0;
    } else {
      const meanMinus1 = this.mean;
      this.mean = meanMinus1 + (x - meanMinus1) / this.n;
      this._var = this._var + (x - meanMinus1) * (x - this.mean);

      const delta = x - meanMinus1;
      const deltaN = delta / this.n;
      const deltaNSquare = deltaN * deltaN;
      const term1 = delta * deltaN * (this.n - 1);
      this.moment4 += term1 * deltaNSquare * (this.n * this.n - 3 * this.n + 3) + 6 * deltaNSquare * this.moment2 - 4 * deltaN * this.moment3;
      this.moment3 += term1 * deltaN * (this.n - 2) - 3 * deltaN * this.moment2;
      this.moment2 += term1;
    }
  }

  static computeStats(...arr: IIterable<number>[]): IStatistics {
    const r = new Statistics();
    arr.forEach((a) => a.forEach(r.push, r));
    return r;
  }
}

export class AdvancedStatistics extends Statistics implements IAdvancedStatistics {
  constructor(public readonly median: number, public readonly q1: number, public readonly q3: number) {
    super();
  }
  static computeAdvancedStats(arr: number[]): IAdvancedStatistics {
    arr = arr.slice().sort((a, b) => a - b);
    const r = new AdvancedStatistics(quantile(arr, 0.5), quantile(arr, 0.25), quantile(arr, 0.75));
    arr.forEach((a) => r.push(a));
    return r;
  }
}

function quantile(arr: number[], percentile: number) {
  const n = arr.length;
  if (n === 0) {
    return NaN;
  }
  if (n < 2 || percentile <= 0) {
    return arr[0];
  }
  if (percentile >= 1) {
    return arr[n - 1];
  }
  const target = percentile * (n - 1);
  const targetIndex = Math.floor(target);
  const a = arr[targetIndex], b = arr[targetIndex + 1];
  return a + (b - a) * (target - targetIndex);
}
