import "reflect-metadata";

interface FieldMetaData {
  length: number;
  fieldType: "STRING" | "CHAR" | "BYTES" | "NUMBER" | "LIST";
  trim: "LTRIM" | "RTRIM";
}

// interface NumberMetaData {
//   type: "DECIMAL" | "DOUBE" | "FLOAT" | "INT" | "LONG" | "SHORT";
//   decimal: number;
//   pointLength?: number;
//   signLength?: number;
// }

export function FIELD(metadata: FieldMetaData) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata("fields", target))
      Reflect.defineMetadata("fields", [], target);

    const fields: Array<{ propertyKey: string; metadata: FieldMetaData }> =
      Reflect.getMetadata("fields", target);
    fields.push({ propertyKey, metadata });
    Reflect.defineMetadata("fields", fields, target);
  };
}

export function parseStringToObject(input: string, targetClass: any): any {
  // const obj = new targetClass();
  const fields: Array<{ propertyKey: string; metadata: FieldMetaData }> =
    Reflect.getMetadata("fields", targetClass);

  console.log(fields);

  let index = 0;

  fields.forEach(({ propertyKey, metadata }) => {
    const { length, trim } = metadata;
    let value: string = input.substring(index, index + length);

    if (trim === "LTRIM") value = value.trimStart();
    if (trim === "RTRIM") value = value.trimEnd();

    targetClass[propertyKey] = value;
    index += length;
  });

  return targetClass;
}

// function parseField() {}

// function parseStringToObject<T>(
//   input: string,
//   targetClass: ClassConstructor<T>
// ): T {
//   const obj = new targetClass();
//   const fields = Reflect.getMetadata("fields", targetClass as Object);

//   return obj;
// }

export class Dog {
  @FIELD({ length: 4, fieldType: "STRING", trim: "RTRIM" })
  name: string;

  @FIELD({ length: 4, fieldType: "STRING", trim: "RTRIM" })
  description: string;

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
