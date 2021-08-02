import { AxiosResponse } from 'axios'
import { useAxios } from './composable'

describe('useAxios', () => {
  test('should have the correct inital values', () => {
    const { cancelledMessage, data, status, statusText, isCancelled, isPending, isSuccessful, hasFailed, headers } =
      useAxios()
    expect(data.value).toBe(undefined)
    expect(headers.value).toBe(undefined)
    expect(status.value).toBe(undefined)
    expect(statusText.value).toBe(undefined)
    expect(cancelledMessage.value).toBe(undefined)
    expect(isCancelled.value).toBe(false)
    expect(isPending.value).toBe(false)
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
    } as AxiosResponse)
    const {
      cancelledMessage,
      data,
      status,
      statusText,
      isCancelled,
      isPending,
      isSuccessful,
      hasFailed,
      headers,
      request,
    } = useAxios({ request: mock } as any)

    await request({ url: '/path' })

    expect(data.value).toBe('data')
    expect(headers.value).toStrictEqual({ ContentType: 'json' })
    expect(status.value).toBe(200)
    expect(statusText.value).toBe('Ok')
    expect(cancelledMessage.value).toBe(undefined)
    expect(isCancelled.value).toBe(false)
    expect(isPending.value).toBe(false)
    expect(isSuccessful.value).toBe(true)
    expect(hasFailed.value).toBe(false)
    expect(mock).toBeCalledWith({
      url: '/path',
      cancelToken: {
        promise: Promise.resolve(),
      },
    })
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
    expect(mock).toBeCalledWith({
      url: '/path',
      cancelToken: {
        promise: Promise.resolve(),
      },
    })
  })

  test('should set isPending correct', async () => {
    const mock = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ status: 200 } as AxiosResponse), 0)
      })
    })
    const { isPending, request } = useAxios({ request: mock } as any)

    const promise = request({ url: '/path' })

    expect(isPending.value).toBe(true)
    await promise
    expect(isPending.value).toBe(false)
  })
})
