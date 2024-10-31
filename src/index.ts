"use strict";

import { Logger } from "sitka";
// import { parseStringToObject } from "./Parse";
// import { Dog } from "./Dto";
import { convertStringToObject } from "./telegram/Decoder";
import { Car } from "./dto/Car";
import { convertObjectToString } from "./telegram/Encoder";

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
  "Turanza   Fuel Efficiency     0323600093Durability Patent   " +
  "Alenza    CUVs & SUVs         0323600087Favorite BapakBapack" +
  "Duravis   Durable & Endurance 0323600090Bisa menyelam laut  " +
  "Ride In Comfort     024200000000";

// const leput =
//   "Avanza    " +
//   "00000004" +
//   "Potenza   Performance Boost   0003236000Murah Meriah Banget " +
//   "Turanza   Fuel Efficiency     0003236000Durability Patent   " +
//   "Alenza    CUVs & SUVs         0003236000Favorite BapakBapack" +
//   "Duravis   Durable & Endurance 0003236000Bisa menyelam laut  " +
//   "Ride In Comfort     000242000000";

// console.log(`[${leput}]`);
// const input =
// "Avanza    00000004Potenza   Performance Boost   0000032360Murah Meriah Banget Turanza   Fuel Efficiency     0000032360Durability Patent   Alenza    CUVs & SUVs         0000032360Favorite BapakBapackDuravis   Durable & Endurance 0000032360Bisa menyelam laut  Ride In Comfort     000002420000";
console.log(`[${input}]`);
const carParsed: Car | null = convertStringToObject(input, Car);
// const parsed = parseStringToObject(input, Dog);

console.log("RESULT");
console.log(carParsed);

console.log(carParsed?.name);

console.log(
  "------------------------------------------------------------------------------------"
);

const carString = convertObjectToString(carParsed!);

console.log(`[${carString}]`);

console.log(
  "------------------------------------------------------------------------------------"
);

input === carString ? console.log("SUCCESS") : console.log("NOT MATCH");
