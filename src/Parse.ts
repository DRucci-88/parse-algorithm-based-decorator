import "reflect-metadata";

enum MetaData {
  Field = "field",
  Number = "number",
  List = "list",
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

interface ListMetaData<T = unknown> {
  typeClass: new () => T;
}

interface FieldParam {
  propertyKey: string;
  metadata: FieldMetaData;
}

export function FIELD(metadata: FieldMetaData) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(MetaData.Field, target))
      Reflect.defineMetadata(MetaData.Field, [], target);

    const fields: Array<FieldParam> = Reflect.getMetadata(
      MetaData.Field,
      target
    );
    fields.push({ propertyKey, metadata });
    // console.log("fields");
    // console.log(fields);
    Reflect.defineMetadata(MetaData.Field, fields, target);
  };
}

interface NumberParam {
  propertyKey: string;
  metadata: NumberMetaData;
}

export function NUMBER(metadata: NumberMetaData) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(MetaData.Number, target))
      Reflect.defineMetadata(MetaData.Number, [], target);

    const numbers: Array<NumberParam> = Reflect.getMetadata(
      MetaData.Number,
      target
    );
    numbers.push({ propertyKey, metadata });
    // console.log("numbers");
    // console.log(numbers);
    Reflect.defineMetadata(MetaData.Number, numbers, target);
  };
}

interface ListParam<T = unknown> {
  propertyKey: string;
  metadata: ListMetaData<T>;
}

export function LIST<T>(metadata: ListMetaData<T>) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(MetaData.List, target))
      Reflect.defineMetadata(MetaData.List, [], target);
    console.log("Le Rucco");
    console.log(metadata.typeClass);

    const lists: Array<ListParam<T>> = Reflect.getMetadata(
      MetaData.List,
      target
    );
    lists.push({ propertyKey, metadata });
    // console.log("lists");
    // console.log(lists);
    Reflect.defineMetadata(MetaData.List, lists, target);
  };
}

export function parseStringToObject<T>(
  input: string,
  targetClass: new () => T
): T {
  // console.log(targetClass);
  const obj = new targetClass() as Object;
  const fields: Array<FieldParam> | null = Reflect.getMetadata(
    MetaData.Field,
    obj
  );
  // console.log("fields");
  // console.log(fields);

  const lists: Array<ListParam<unknown>> | null = Reflect.getMetadata(
    MetaData.List,
    obj
  );

  // console.log("lists");
  // console.log(lists);

  let index = 0;

  let value: string = "";

  fields?.forEach(({ propertyKey, metadata }) => {
    const { type, length, trim } = metadata;

    switch (type) {
      case "STRING":
        value = input.substring(index, index + length);
        if (trim === "LTRIM") value = value.trimStart();
        if (trim === "RTRIM") value = value.trimEnd();

        obj[propertyKey] = value;
        index += length;
        break;
      case "NUMBER":
        value = input.substring(index, index + length);
        if (trim === "LTRIM") value = value.trimStart();
        if (trim === "RTRIM") value = value.trimEnd();

        const numbers: Array<NumberParam> = Reflect.getMetadata(
          MetaData.Number,
          obj as Object
        );
        const number:
          | {
              propertyKey: string;
              metadata: NumberMetaData;
            }
          | undefined = numbers.find((number, index) => {
          return number.propertyKey === propertyKey;
        });
        obj[propertyKey] = parseNumber(value, number);
        index += length;
        break;
      // case "LIST":
      //   value = input.substring(index, input.length);
      //   // const lists: Array<{ propertyKey: string; metadata: ListMetaData }> =
      //   break;
      default:
        break;
    }
  });

  lists?.forEach(({ propertyKey, metadata }) => {
    // console.log("!!! lists.forEach !!!");
    // console.log(propertyKey);
    const { typeClass } = metadata;
    // console.log(typeClass);
    const itemInstance = new typeClass();
    // console.log(itemInstance);
    const itemFields: Array<{
      propertyKey: string;
      metadata: FieldMetaData;
    }> = Reflect.getMetadata(MetaData.Field, itemInstance);
    // console.log(itemFields);
    let itemLength = 0;
    for (const itemField of itemFields) {
      itemLength += itemField.metadata.length;
    }
    // console.log(itemLength);

    obj[propertyKey] = [];

    value = input.substring(index, index + 4);
    // console.log(value);
    index += 4;
    const count: number = Number(value);
    // console.log(count);
    for (let i = 0; i < count; i++) {
      const itemString = input.substring(index, index + itemLength);
      // console.log(`itemString [${itemString}]`);
      const parsedItem = parseStringToObject(itemString, typeClass);
      // console.log(parsedItem);
      obj[propertyKey].push(parsedItem);
      index += itemLength;
    }
  });

  return obj as T;
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
