import { FieldNumberMeta, Meta } from "./Meta";

export interface FieldNumberParam {
  propertyKey: string;
  metadata: FieldNumberMeta;
}

export function FieldNumber(metadata: FieldNumberMeta) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(Meta.FIELD_NUMBER, target))
      Reflect.defineMetadata(Meta.FIELD_NUMBER, [], target);

    const numbers: Array<FieldNumberParam> = Reflect.getMetadata(
      Meta.FIELD_NUMBER,
      target
    );
    numbers.push({ propertyKey, metadata });
    Reflect.defineMetadata(Meta.FIELD_NUMBER, numbers, target);
  };
}
