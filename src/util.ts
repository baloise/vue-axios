// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function isPromise(promise: any): boolean {
  return !!promise && typeof promise.then === 'function'
}
