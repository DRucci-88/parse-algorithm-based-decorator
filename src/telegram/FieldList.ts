import { FieldListMeta, Meta } from "./Meta";

export interface FieldListParam<T> {
  propertyKey: string;
  metadata: FieldListMeta<T>;
}

export function FieldList<T>(metadata: FieldListMeta<T>) {
  return function (target: Object, propertyKey: string) {
    if (!Reflect.hasMetadata(Meta.FIELD_LIST, target))
      Reflect.defineMetadata(Meta.FIELD_LIST, [], target);

    const lists: Array<FieldListParam<T>> = Reflect.getMetadata(
      Meta.FIELD_LIST,
      target
    );
    lists.push({ propertyKey, metadata });
    Reflect.defineMetadata(Meta.FIELD_LIST, lists, target);
  };
}
