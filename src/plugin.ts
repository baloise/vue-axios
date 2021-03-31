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

import { AxiosRequestConfig } from 'axios'
import { Plugin } from 'vue'
import { $axios } from './axios'

export const vueAxios: Plugin = {
  async install(app, config: AxiosRequestConfig = {}) {
    $axios.defaults = {
      ...$axios.defaults,
      ...config,
    }

    app.config.globalProperties.$axios = $axios
  },
}
