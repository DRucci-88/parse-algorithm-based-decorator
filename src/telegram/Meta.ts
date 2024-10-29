import { ClassConstructor } from "class-transformer";

export enum Meta {
  FIELD = "field",
  FIELD_NUMBER = "fieldnumber",
  FIELD_LIST = "fieldlist",
}

export interface FieldMeta {
  type: "STRING" | "CHAR" | "BYTES" | "NUMBER" | "LIST";
  length: number;
  trim: "LTRIM" | "RTRIM";
}

export interface FieldNumberMeta {
  type: "DECIMAL" | "DOUBE" | "FLOAT" | "INT" | "LONG" | "SHORT";
  decimal: number;
  pointLength?: number;
  signLength?: number;
}

export interface FieldListMeta<T> {
  typeClass: ClassConstructor<T>;
}
