import { ref, Ref, shallowRef } from 'vue'
import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { $axios } from './axios'
import { isPromise, wait } from './utils'

export interface RequestArgs {
  url: string
  options: AxiosRequestConfig
}

export interface AxiosResponseComposables<T, E = unknown, H = unknown> {
  response: Ref<AxiosResponse<T> | undefined>
  data: Ref<T | undefined>
  error: Ref<AxiosError<E> | undefined>
  headers: Ref<H>
  status: Ref<number>
  statusText: Ref<string>
  abortMessage: Ref<string>
  hasFailed: Ref<boolean>
  isFinished: Ref<boolean>
  isSuccessful: Ref<boolean>
  aborted: Ref<boolean>
}

export interface AxiosComposables<T, E = unknown> extends AxiosResponseComposables<T, E> {
  isLoading: Ref<boolean>
  abort: (message: string) => void
  request: (config: AxiosRequestConfig | Promise<RequestArgs>) => Promise<void>
  requestMock: (
    config: AxiosRequestConfig | Promise<RequestArgs>,
    response: AxiosResponse<T>,
    delay?: number,
  ) => Promise<void>
  get: (url: string, config: AxiosRequestConfig) => Promise<void>
  head: (url: string, config: AxiosRequestConfig) => Promise<void>
  options: (url: string, config: AxiosRequestConfig) => Promise<void>
  post: (url: string, data: T, config: AxiosRequestConfig) => Promise<void>
  put: (url: string, data: T, config: AxiosRequestConfig) => Promise<void>
  patch: (url: string, data: T, config: AxiosRequestConfig) => Promise<void>
  remove: (url: string, config: AxiosRequestConfig) => Promise<void>
}

export function useAxios<T, E = unknown, H = unknown>(instance: AxiosInstance = $axios): AxiosComposables<T, E> {
  const CancelToken = Axios.CancelToken
  const source = CancelToken.source()

  const aborted = ref(false)
  const abortMessage = ref<string>()
  const isLoading = ref(false)
  const hasFailed = ref(false)
  const isSuccessful = ref(false)
  const isFinished = ref(false)
  const status = ref<number>()
  const statusText = ref<string>()
  const response = shallowRef<AxiosResponse<T>>()
  const data = shallowRef<T>()
  const error = shallowRef<AxiosError<E>>()
  const headers = ref<H>()

  function abort(message?: string) {
    if (isFinished.value || !isLoading.value) return

    source.cancel(message)
    abortMessage.value = message
  }

  function reset() {
    response.value = undefined
    data.value = undefined
    error.value = undefined
    status.value = 0
    statusText.value = undefined
    abortMessage.value = undefined
    isLoading.value = true
    hasFailed.value = false
    isSuccessful.value = false
    aborted.value = false
    isFinished.value = false
  }

  function map(res: AxiosResponse) {
    status.value = res.status
    status.value = res.status
    statusText.value = res.statusText
    isSuccessful.value = res.status < 400
    hasFailed.value = !isSuccessful.value
    data.value = res.data
    headers.value = res.headers as any
  }

  async function request(config: AxiosRequestConfig): Promise<void>
  async function request(config: Promise<RequestArgs>): Promise<void>
  async function request(config: AxiosRequestConfig | Promise<RequestArgs>): Promise<void> {
    reset()

    if (isPromise(config)) {
      const { url, options } = (await config) as RequestArgs
      config = { url, ...options }
    }

    try {
      response.value = await instance.request<T>({
        ...config,
        cancelToken: source.token,
      })
      map(response.value)
    } catch (_error) {
      error.value = _error
      hasFailed.value = true
    } finally {
      isLoading.value = false
      isFinished.value = true
    }
  }

  async function requestMock(config: AxiosRequestConfig, res: AxiosResponse<T>, delay?: number): Promise<void>
  async function requestMock(config: Promise<RequestArgs>, res: AxiosResponse<T>, delay?: number): Promise<void>
  async function requestMock(
    config: AxiosRequestConfig | Promise<RequestArgs>,
    res: AxiosResponse<T>,
    delay?: number,
  ): Promise<void> {
    reset()

    if (isPromise(config)) {
      const { url, options } = (await config) as RequestArgs
      config = { url, ...options }
    }

    try {
      await wait(delay)
      response.value = res
      map(res)
    } catch (_error) {
      error.value = _error
      hasFailed.value = true
    } finally {
      isLoading.value = false
      isFinished.value = true
    }
  }

  function get(url: string, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'GET', url })
  }

  function head(url: string, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'HEAD', url })
  }

  function options(url: string, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'OPTIONS', url })
  }

  function post(url: string, data: T, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'POST', url, data })
  }

  function put(url: string, data: T, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'PUT', url, data })
  }

  function patch(url: string, data: T, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'PATCH', url, data })
  }

  function remove(url: string, config: AxiosRequestConfig): Promise<void> {
    return request({ ...config, method: 'DELETE', url })
  }

  return {
    data,
    response,
    error,
    headers,
    status,
    statusText,
    isLoading: isLoading,
    hasFailed,
    isSuccessful,
    isFinished,
    aborted,
    abortMessage,
    abort,
    request,
    requestMock,
    get,
    head,
    options,
    post,
    patch,
    put,
    remove,
  }
}
