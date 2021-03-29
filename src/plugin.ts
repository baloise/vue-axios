/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */

import { AxiosRequestConfig, AxiosInterceptorManager, AxiosResponse } from 'axios'
import { Plugin } from 'vue'
import { $axios } from './axios'

export interface HttpConfig {
  defaults?: AxiosRequestConfig
  interceptors?: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
}

export const http: Plugin = {
  async install(app, config: HttpConfig = {}) {
    $axios.defaults = {
      ...$axios.defaults,
      ...config.defaults,
    }

    app.config.globalProperties.$http = $axios
  },
}
