export function isPromise(promise: any): boolean {
  return !!promise && typeof promise.then === 'function'
}
