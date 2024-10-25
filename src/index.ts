"use strict";

import { Logger } from "sitka";
import { Dog, parseStringToObject } from "./Parse";

export class Example {
  /* Private Instance Fields */

  private _logger: Logger;

  /* Constructor */

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
  }

  /* Public Instance Methods */

  public exampleMethod(param: string): string {
    this._logger.debug("Received: " + param);
    return param;
  }
}

const input = "abcdefgh111";
console.log(input);

const parsed = parseStringToObject(input, Dog);

console.log(parsed);
