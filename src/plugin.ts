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

import { AxiosDefaults } from 'axios'
import { Plugin } from 'vue'
import { $axios } from './axios'

export const vueAxios: Plugin = {
  async install(app, defaults: AxiosDefaults<unknown>) {
    $axios.defaults = {
      ...$axios.defaults,
      ...defaults,
    }

    app.config.globalProperties.$axios = $axios
  },
}
