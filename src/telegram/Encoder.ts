import "reflect-metadata";
import { FieldParam } from "./Field";
import { Meta } from "./Meta";
// import { FieldNumberParam } from "./FieldNumber";
// import { FieldListParam } from "./FieldList";

export function convertObjectToString(obj: Object): string | null {
  const fields: Array<FieldParam> | undefined = Reflect.getMetadata(
    Meta.FIELD,
    obj
  );
  // console.log(fields);

  // const fieldNumbers: Array<FieldNumberParam> | undefined = Reflect.getMetadata(
  //   Meta.FIELD_NUMBER,
  //   obj
  // );
  // console.log(fieldNumbers);

  // const fieldLists: Array<FieldListParam<typeof obj>> | undefined =
  //   Reflect.getMetadata(Meta.FIELD_LIST, obj);
  // console.log(fieldLists);

  if (!fields) return null;

  let resultString: string = "";

  for (let i = 0; i < fields?.length; i++) {
    const field = fields[i];
    const { propertyKey } = field;
    const { type, length } = field.metadata;
    // console.log("obj[propertyKey]");
    // console.log(obj[propertyKey]);
    switch (type) {
      case "STRING":
        resultString += (obj[propertyKey] as string).padEnd(length, " ");
        break;
      case "NUMBER":
        resultString += (obj[propertyKey] as number)
          .toString()
          .padStart(length, "0");
        break;
      case "LIST":
        const param: {
          objArray: Array<Object>;
        } = { objArray: obj[propertyKey] };
        resultString += parseList(param);
        break;
      default:
        break;
    }
    // console.log("resultString");
    // console.log(resultString + "\n");
  }

  return resultString;
}

function parseList(param: { objArray: Array<Object> }): string | null {
  // console.log("parseList");
  // console.log(param.objArray);
  if (!param.objArray) return null;
  let resultString = "";

  resultString += param.objArray.length.toString().padStart(8, "0");

  for (let i = 0; i < param.objArray.length; i++) {
    resultString += convertObjectToString(param.objArray[i]);
  }
  return resultString;
}
