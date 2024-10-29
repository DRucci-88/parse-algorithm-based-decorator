"use strict";

import { Logger } from "sitka";
// import { parseStringToObject } from "./Parse";
// import { Dog } from "./Dto";
import { convertStringToObject } from "./telegram/Decoder";
import { Car } from "./dto/Car";

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

// const input = "AsepBudi9870002akuka90110001leo";
// console.log(input);

// const input =
//   "Avanza    Ride In Comfort     024200000000" +
//   "00000004" +
//   "Potenza   Performance Boost   0323600000Murah Meriah Banget " +
//   "Turanza   Fuel Efficiency     0323600000Durability Patent   " +
//   "Alenza    CUVs & SUVs         0323600000Favorite BapakBapack" +
//   "Duravis   Durable & Endurance 0323600000Bisa menyelam laut  ";

const input =
  "Avanza    " +
  "00000004" +
  "Potenza   Performance Boost   0323600000Murah Meriah Banget " +
  "Turanza   Fuel Efficiency     0323600000Durability Patent   " +
  "Alenza    CUVs & SUVs         0323600000Favorite BapakBapack" +
  "Duravis   Durable & Endurance 0323600000Bisa menyelam laut  " +
  "Ride In Comfort     024200000000";

const parsed = convertStringToObject(input, Car);
// const parsed = parseStringToObject(input, Dog);

console.log("RESULT");
console.log(parsed);

console.log(parsed?.name);
