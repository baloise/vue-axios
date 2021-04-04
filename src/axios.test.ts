import { $axios } from './axios'

describe('axios defaults', () => {
  test('should have a default timeout', () => {
    expect($axios.defaults.timeout).toBe(5000)
  })

  test('should have a default headers', () => {
    expect($axios.defaults.headers.common.Accept).toBe('application/json')
    expect($axios.defaults.headers.common.ContentType).toBe('application/json')
  })
})
