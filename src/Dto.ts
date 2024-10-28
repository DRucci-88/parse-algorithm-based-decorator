import { FIELD, LIST, NUMBER } from "./Parse";

export class Food {
  @FIELD({ length: 2, type: "STRING", trim: "RTRIM" })
  name: string;

  @FIELD({ length: 1, type: "STRING", trim: "RTRIM" })
  description: string;
  // @FIELD({ length: 7, type: "NUMBER", trim: "LTRIM" })
  // @NUMBER({ decimal: 4, type: "DECIMAL" })
  // price: number;
}

export class Dog {
  @FIELD({ length: 4, type: "STRING", trim: "RTRIM" })
  name: string;

  @FIELD({ length: 4, type: "STRING", trim: "RTRIM" })
  description: string;

  @FIELD({ length: 3, type: "NUMBER", trim: "LTRIM" })
  @NUMBER({ type: "DECIMAL", decimal: 2 })
  age: number;

  @FIELD({ length: 0, type: "LIST", trim: "LTRIM" })
  @LIST({ typeClass: Food })
  favorite: Array<Food>;

  constructor() {}
}

function Logger(target: Object, propertyKey: string) {
  console.log(`Target ${target}`);
  console.log(`propertyKey ${propertyKey}`);
}

export class Cat {
  @Logger
  name: string;

  age: number;

  description: string;
}
