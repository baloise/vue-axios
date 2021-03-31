import { ref, Ref } from 'vue'
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { $axios } from './axios'
import { isPromise } from './util'

export interface RequestArgs {
  url: string
  options: AxiosRequestConfig
}

export interface AxiosResponseComposables<T, E = unknown, H = unknown> {
  data: Ref<T | undefined>
  error: Ref<E | undefined>
  headers: Ref<H>
  status: Ref<number>
  statusText: Ref<string>
  cancelledMessage: Ref<string>
  hasFailed: Ref<boolean>
  isSuccessful: Ref<boolean>
  isCancelled: Ref<boolean>
}

export interface AxiosComposables<T, E = unknown> extends AxiosResponseComposables<T, E> {
  isPending: Ref<boolean>
  cancel: () => void
  request: (config: AxiosRequestConfig | Promise<RequestArgs>) => Promise<void>
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

  const isCancelled = ref(false)
  const isPending = ref(false)
  const hasFailed = ref(false)
  const isSuccessful = ref(false)
  const status = ref<number>(0)
  const statusText = ref<string>()
  const cancelledMessage = ref<string>()
  const error = ref<E>()
  const data = ref<T>()
  const headers = ref<H>()

  function cancel(message?: string) {
    source.cancel(message)
    cancelledMessage.value = message
  }

  function reset() {
    data.value = undefined
    error.value = undefined
    status.value = 0
    statusText.value = undefined
    cancelledMessage.value = undefined
    isPending.value = true
    hasFailed.value = false
    isCancelled.value = false
    isSuccessful.value = false
  }

  function map(response: AxiosResponse) {
    status.value = response.status
    isSuccessful.value = response.status < 400
    status.value = response.status
    statusText.value = response.statusText
    hasFailed.value = !isSuccessful.value
    data.value = response.data
    headers.value = response.headers
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
      const response = await instance.request<T>({
        ...config,
        cancelToken: source.token,
      })
      map(response)
    } catch (_error) {
      error.value = _error
      hasFailed.value = true
    } finally {
      isPending.value = false
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
    error,
    headers,
    status,
    statusText,
    isPending,
    hasFailed,
    isSuccessful,
    isCancelled,
    cancelledMessage,
    cancel,
    request,
    get,
    head,
    options,
    post,
    patch,
    put,
    remove,
  }
}
