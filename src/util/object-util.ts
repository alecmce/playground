export function prune<T extends object>(object: T): T {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined)) as T
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
