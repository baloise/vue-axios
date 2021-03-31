import { isPromise } from './util'

describe('util', () => {
  describe('isPromise', () => {
    test('should ', () => {
      expect(isPromise(new Promise(() => undefined))).toBe(true)
    })
  })
})
