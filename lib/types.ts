export type ConvexId<T extends string> = string & { readonly __brand: T };

export function castId<T extends string>(id: string): ConvexId<T> {
  return id as ConvexId<T>;
}
