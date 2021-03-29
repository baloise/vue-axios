import Axios from 'axios'

Axios.defaults.timeout = 5000
Axios.defaults.headers.common.Accept = 'application/json'
Axios.defaults.headers.common.ContentType = 'application/json'

export const $axios = Axios
