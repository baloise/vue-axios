import { ref, Ref } from 'vue'
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { $axios } from './axios'
import { isPromise } from './util'

export interface RequestArgs {
  url: string
  options: AxiosRequestConfig
}

export interface HttpResponse<T, E> {
  data: Ref<T | undefined>
  error: Ref<E | undefined>
  status: Ref<number>
  statusText: Ref<string>
  cancelledMessage: Ref<string>
  hasFailed: Ref<boolean>
  isSuccessful: Ref<boolean>
  isCancelled: Ref<boolean>
}

export interface HttpClient<T, E> extends HttpResponse<T, E> {
  isPending: Ref<boolean>
  cancel: () => void
  send: (config: AxiosRequestConfig | Promise<RequestArgs>) => Promise<void>
}

export function useAxios<T, E>(instance: AxiosInstance = $axios): HttpClient<T, E> {
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

  function map(httpResponse: AxiosResponse) {
    status.value = httpResponse.status
    isSuccessful.value = httpResponse.status < 400
    status.value = httpResponse.status
    statusText.value = httpResponse.statusText
    hasFailed.value = !isSuccessful.value
    data.value = httpResponse.data
  }

  async function send(config: AxiosRequestConfig): Promise<void>
  async function send(config: Promise<RequestArgs>): Promise<void>
  async function send(config: AxiosRequestConfig | Promise<RequestArgs>): Promise<void> {
    reset()

    if (isPromise(config)) {
      const { url, options } = (await config) as RequestArgs
      config = { url, ...options }
    }

    try {
      const httpResponse = await instance.request<T>({
        ...config,
        cancelToken: source.token,
      })
      map(httpResponse)
    } catch (_error) {
      error.value = _error
      hasFailed.value = true
    } finally {
      isPending.value = false
    }
  }

  return {
    data,
    error,
    status,
    statusText,
    isPending,
    hasFailed,
    isSuccessful,
    isCancelled,
    cancelledMessage,
    send,
    cancel,
  }
}
