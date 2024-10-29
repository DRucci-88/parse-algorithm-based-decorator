import "reflect-metadata";
import { ClassConstructor } from "class-transformer";
import { Meta } from "./Meta";
import { FieldParam } from "./Field";
import { FieldNumberParam } from "./FieldNumber";
import { FieldListParam } from "./FieldList";

export function convertStringToObject<T>(
  input: string,
  targetClass: ClassConstructor<T>
): T | null {
  const obj = new targetClass() as Object;
  const fields: Array<FieldParam> | undefined = Reflect.getMetadata(
    Meta.FIELD,
    obj
  );

  const fieldNumbers: Array<FieldNumberParam> | undefined = Reflect.getMetadata(
    Meta.FIELD_NUMBER,
    obj
  );

  const fieldLists: Array<FieldListParam<Object>> | undefined =
    Reflect.getMetadata(Meta.FIELD_LIST, obj);

  let index: number = 0;

  let tempSubset: string = "";

  if (!fields) return null;

  for (let i = 0; i < fields?.length; i++) {
    const field = fields[i];
    const { propertyKey } = field;
    const { type, length, trim } = field.metadata;

    tempSubset = "";

    switch (type) {
      case "STRING":
        tempSubset = input.substring(index, index + length);
        if (trim === "LTRIM") return null;
        tempSubset = tempSubset.trimEnd();

        obj[propertyKey] = tempSubset;
        index += length;
        break;
      case "NUMBER":
        tempSubset = input.substring(index, index + length);
        if (trim === "LTRIM") tempSubset = tempSubset.trimStart();
        else if (trim === "RTRIM") tempSubset = tempSubset.trimEnd();

        const fieldNumber: FieldNumberParam | undefined = fieldNumbers?.find(
          (fieldNumber) => {
            return fieldNumber.propertyKey === propertyKey;
          }
        );

        if (fieldNumber === undefined) return null;
        obj[propertyKey] = parseFieldNumber(tempSubset, fieldNumber) ?? "NaN";
        index += length;
        break;
      case "LIST":
        const fieldList: FieldListParam<Object> | undefined = fieldLists?.find(
          (fieldList) => {
            return fieldList.propertyKey === propertyKey;
          }
        );
        if (fieldList === undefined) return null;
        const param: {
          obj: Object;
          input: string;
          index: number;
          fieldList: FieldListParam<Object>;
        } = { obj, input, index, fieldList };

        if (parseList(param) === false) return null;
        obj[propertyKey] = param.obj[propertyKey];
        index = param.index;
      default:
        break;
    }
  }

  return obj as T;
}

function parseFieldNumber(
  tempSubset: string,
  fieldNumber: FieldNumberParam
): number | null {
  let value: number;

  switch (fieldNumber.metadata.type) {
    case "DECIMAL":
    case "DOUBE":
    case "FLOAT":
      const decimal = fieldNumber?.metadata.decimal ?? 0;
      value = Number(
        tempSubset.slice(0, -1 * decimal) + "." + tempSubset.slice(-1 * decimal)
      );
      if (isNaN(value)) {
        /// TODO Handling Edge Cases
      }
      return value;
    case "LONG":
    case "INT":
    case "SHORT":
      value = Number(tempSubset);
      return value;
    default:
      return null;
  }
}

function parseList(param: {
  obj: Object;
  input: string;
  index: number;
  fieldList: FieldListParam<Object>;
}): boolean {
  const { propertyKey, metadata } = param.fieldList;
  const { typeClass } = metadata;
  const classInstance = new typeClass();
  const fields: Array<FieldParam> | undefined = Reflect.getMetadata(
    Meta.FIELD,
    classInstance
  );
  if (fields === undefined) return false;
  let lengthInput = 0;
  for (const field of fields) {
    lengthInput += field.metadata.length;
  }
  param.obj[propertyKey] = [];

  // Get count of list, usually 8 char before List at DevonC
  const tempSubset: string = param.input.substring(
    param.index,
    param.index + 8
  );
  param.index += 8;
  const count: number = Number(tempSubset);

  for (let i = 0; i < count; i++) {
    const childInput = param.input.substring(
      param.index,
      param.index + lengthInput
    );
    const parsedInput = convertStringToObject(childInput, typeClass);
    if (parsedInput === null) return false;
    param.obj[propertyKey].push(parsedInput);
    param.index += lengthInput;
  }
  return true;
}
