import { AxiosResponse } from 'axios'
import { useAxios } from './composable'

describe('useAxios', () => {
  test('should have the correct inital values', () => {
    const { abortMessage, data, status, statusText, aborted, isLoading, isSuccessful, hasFailed, headers } = useAxios()
    expect(data.value).toBe(undefined)
    expect(headers.value).toBe(undefined)
    expect(status.value).toBe(undefined)
    expect(statusText.value).toBe(undefined)
    expect(abortMessage.value).toBe(undefined)
    expect(aborted.value).toBe(false)
    expect(isLoading.value).toBe(false)
    expect(isSuccessful.value).toBe(false)
    expect(hasFailed.value).toBe(false)
  })

  test('should map the axios response object to the reactive values', async () => {
    const mock = jest.fn().mockReturnValue({
      status: 200,
      statusText: 'Ok',
      data: 'data',
      headers: {
        ContentType: 'json',
      },
      config: {},
    } as AxiosResponse)
    const { abortMessage, data, status, statusText, aborted, isLoading, isSuccessful, hasFailed, headers, request } =
      useAxios({ request: mock } as any)

    await request({ url: '/path' })

    expect(data.value).toBe('data')
    expect(headers.value).toStrictEqual({ ContentType: 'json' })
    expect(status.value).toBe(200)
    expect(statusText.value).toBe('Ok')
    expect(abortMessage.value).toBe(undefined)
    expect(aborted.value).toBe(false)
    expect(isLoading.value).toBe(false)
    expect(isSuccessful.value).toBe(true)
    expect(hasFailed.value).toBe(false)
  })

  test('should map the failed response', async () => {
    const mock = jest.fn().mockReturnValue({
      status: 404,
      statusText: 'Not Found',
    } as AxiosResponse)
    const { status, statusText, isSuccessful, hasFailed, request } = useAxios({ request: mock } as any)

    await request({ url: '/path' })

    expect(status.value).toBe(404)
    expect(statusText.value).toBe('Not Found')
    expect(isSuccessful.value).toBe(false)
    expect(hasFailed.value).toBe(true)
  })

  test('should set isPending correct', async () => {
    const mock = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ status: 200 } as AxiosResponse), 0)
      })
    })
    const { isLoading, request } = useAxios({ request: mock } as any)

    const promise = request({ url: '/path' })

    expect(isLoading.value).toBe(true)
    await promise
    expect(isLoading.value).toBe(false)
  })
})
