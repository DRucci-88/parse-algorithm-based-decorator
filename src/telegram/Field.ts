import { FieldMeta, Meta } from "./Meta";

export interface FieldParam {
  propertyKey: string;
  metadata: FieldMeta;
}

export function Field(metadata: FieldMeta) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(Meta.FIELD, target))
      Reflect.defineMetadata(Meta.FIELD, [], target);

    const fields: Array<FieldParam> = Reflect.getMetadata(Meta.FIELD, target);
    fields.push({ propertyKey, metadata });
    Reflect.defineMetadata(Meta.FIELD, fields, target);
  };
}
