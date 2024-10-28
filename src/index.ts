"use strict";

import { Logger } from "sitka";
import { parseStringToObject } from "./Parse";
import { Dog } from "./Dto";

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

const input = "AsepBudi9870002akuka90110001leo";
console.log(input);

const parsed = parseStringToObject(input, Dog);

console.log("RESULT");
console.log(parsed);
