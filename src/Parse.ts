import "reflect-metadata";

enum MetaData {
  Field = "field",
  Number = "number",
}

interface FieldMetaData {
  type: "STRING" | "CHAR" | "BYTES" | "NUMBER" | "LIST";
  length: number;
  trim: "LTRIM" | "RTRIM";
}

interface NumberMetaData {
  type: "DECIMAL" | "DOUBE" | "FLOAT" | "INT" | "LONG" | "SHORT";
  decimal: number;
  pointLength?: number;
  signLength?: number;
}

export function FIELD(metadata: FieldMetaData) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(MetaData.Field, target))
      Reflect.defineMetadata(MetaData.Field, [], target);

    const fields: Array<{ propertyKey: string; metadata: FieldMetaData }> =
      Reflect.getMetadata(MetaData.Field, target);
    fields.push({ propertyKey, metadata });
    console.log("fields");
    console.log(fields);
    Reflect.defineMetadata(MetaData.Field, fields, target);
  };
}

export function NUMBER(metadata: NumberMetaData) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(MetaData.Number, target))
      Reflect.defineMetadata(MetaData.Number, [], target);

    const numbers: Array<{ propertyKey: string; metadata: NumberMetaData }> =
      Reflect.getMetadata(MetaData.Number, target);
    numbers.push({ propertyKey, metadata });
    console.log("numbers");
    console.log(numbers);
    Reflect.defineMetadata(MetaData.Number, numbers, target);
  };
}

export function parseStringToObject<T>(
  input: string,
  targetClass: new () => T
): T {
  const obj = new targetClass();
  const fields: Array<{ propertyKey: string; metadata: FieldMetaData }> =
    Reflect.getMetadata(MetaData.Field, obj as Object);

  let index = 0;

  fields.forEach(({ propertyKey, metadata }) => {
    const { type, length, trim } = metadata;

    let value: string = "";

    switch (type) {
      case "STRING":
        value = input.substring(index, index + length);
        if (trim === "LTRIM") value = value.trimStart();
        if (trim === "RTRIM") value = value.trimEnd();

        obj[propertyKey] = value;
        break;
      case "NUMBER":
        value = input.substring(index, index + length);
        if (trim === "LTRIM") value = value.trimStart();
        if (trim === "RTRIM") value = value.trimEnd();

        const numbers: Array<{
          propertyKey: string;
          metadata: NumberMetaData;
        }> = Reflect.getMetadata(MetaData.Number, obj as Object);
        console.log(numbers);
        const number:
          | {
              propertyKey: string;
              metadata: NumberMetaData;
            }
          | undefined = numbers.find((number, index) => {
          return number.propertyKey === propertyKey;
        });
        console.log(number);
        obj[propertyKey] = parseNumber(value, number);
        // obj[propertyKey] = 901;
        break;
      case "LIST":
        value = input.substring(index, input.length);

        break;
      default:
        break;
    }

    // obj[propertyKey] = value;
    index += length;
  });

  return obj;
}

function parseNumber(
  input: string,
  number:
    | {
        propertyKey: string;
        metadata: NumberMetaData;
      }
    | undefined
): number {
  const decimal = number?.metadata.decimal ?? 0;
  // const value = Number(input);
  const value = Number(
    input.slice(0, -1 * decimal) + "." + input.slice(-1 * decimal)
  );
  if (isNaN(value)) {
    /// TODO Handling Edge Cases
  }

  return value;
}

export class Dog {
  @FIELD({ length: 4, type: "STRING", trim: "RTRIM" })
  name: string;

  @FIELD({ length: 4, type: "STRING", trim: "RTRIM" })
  description: string;

  @FIELD({ length: 3, type: "NUMBER", trim: "LTRIM" })
  @NUMBER({ type: "DECIMAL", decimal: 2 })
  age: number;

  // @FIELD({ length: 0, type: "LIST", trim: "LTRIM" })
  // favorite: Array<Food>;

  constructor() {}
}

// class Food {
//   @FIELD({ length: 5, type: "STRING", trim: "RTRIM" })
//   name: string;

//   @FIELD({ length: 7, type: "NUMBER", trim: "LTRIM" })
//   @NUMBER({ decimal: 4, type: "DECIMAL" })
//   price: number;
// }

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
