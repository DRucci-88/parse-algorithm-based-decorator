import "reflect-metadata";
import { ClassConstructor } from "class-transformer";

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

interface ListMetaData<T> {
  typeClass: ClassConstructor<T>;
}

interface ListParam<T> {
  propertyKey: string;
  metadata: ListMetaData<T>;
}

export function LIST<T>(metadata: ListMetaData<T>) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(MetaData.List, target))
      Reflect.defineMetadata(MetaData.List, [], target);
    // console.log("Le Rucco");
    // console.log(metadata.typeClass);

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
  targetClass: ClassConstructor<T>
): T {
  // console.log(targetClass);
  const obj = new targetClass() as Object;
  const fields: Array<FieldParam> | null = Reflect.getMetadata(
    MetaData.Field,
    obj
  );
  // console.log("fields");
  // console.log(fields);

  const numbers: Array<NumberParam> = Reflect.getMetadata(
    MetaData.Number,
    obj as Object
  );

  const lists: Array<ListParam<Object>> | null = Reflect.getMetadata(
    MetaData.List,
    obj
  );

  // console.log("lists");
  // console.log(lists);

  let index = 0;

  let value: string = "";

  fields?.forEach(({ propertyKey, metadata }) => {
    const { type, length, trim } = metadata;
    // console.log("Le Rucco");
    // console.log(propertyKey);
    // console.log(metadata.type);

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

        const number: NumberParam | undefined = numbers.find((number) => {
          return number.propertyKey === propertyKey;
        });
        if (number === undefined) break;
        obj[propertyKey] = parseNumber(value, number);
        index += length;
        break;
      case "LIST":
        const list: ListParam<Object> | undefined = lists?.find((list) => {
          return list.propertyKey === propertyKey;
        });
        if (list === undefined) break;
        const param: {
          obj: object;
          input: string;
          index: number;
          list: ListParam<Object>;
        } = { obj, input, index, list };
        parseList(param);
        obj[propertyKey] = param.obj[propertyKey];
        index = param.index;
        console.log(`LIST ${index}`);
        break;
      default:
        break;
    }
    console.log(propertyKey);
    console.log(index);
    console.log(value + "\n");
  });

  // console.log("Le Rucco");
  // console.log(index);
  // console.log(input.length);

  return obj as T;
}

function parseNumber(input: string, number: NumberParam): number {
  const decimal = number?.metadata.decimal ?? 0;
  let value: number = 0;

  switch (number.metadata.type) {
    case "DECIMAL":
    case "DOUBE":
    case "FLOAT":
      value = Number(
        input.slice(0, -1 * decimal) + "." + input.slice(-1 * decimal)
      );
      if (isNaN(value)) {
        /// TODO Handling Edge Cases
      }
      return value;
    case "LONG":
    case "INT":
    case "SHORT":
      value = Number(input);
      return value;
    default:
      return 0;
  }
}

// Pass by reference not pass by value
function parseList(param: {
  obj: object;
  input: string;
  index: number;
  list: ListParam<Object>;
}): void {
  let value: string = "";
  const { propertyKey, metadata } = param.list;
  // console.log("!!! lists.forEach !!!");
  // console.log(propertyKey);
  const { typeClass } = metadata;
  // console.log(typeClass);
  const itemInstance = new typeClass();
  // console.log(itemInstance);
  const itemFields: Array<FieldParam> = Reflect.getMetadata(
    MetaData.Field,
    itemInstance
  );
  // console.log(itemFields);
  let itemLength = 0;
  for (const itemField of itemFields) {
    itemLength += itemField.metadata.length;
  }
  // console.log(itemLength);

  param.obj[propertyKey] = [];

  value = param.input.substring(param.index, param.index + 4);
  // console.log(value);
  param.index += 4;
  const count: number = Number(value);
  // console.log(count);
  for (let i = 0; i < count; i++) {
    const itemString = param.input.substring(
      param.index,
      param.index + itemLength
    );
    // console.log(`itemString [${itemString}]`);
    const parsedItem = parseStringToObject(itemString, typeClass);
    // console.log(parsedItem);
    param.obj[propertyKey].push(parsedItem);
    param.index += itemLength;
  }
  console.log(`parseList ${param.index}`);
}
