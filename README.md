<table align="center" cellspacing="0" cellpadding="0" style="border: none;">
<tr style="border: none;">
  <td style="border: none;">
    <img width="200px" src="https://vuejs.org/images/logo.png" />
  </td>
  <td style="border: none;">
    <h1 style="font-size: 10em">+</h1>
  </td>
  <td style="border: none;">
    <img width="200px" src="https://axios-http.com/assets/logo.svg" />
  </td>
</tr>
</table>

# vue-axios

A small wrapper library for the simple promise based HTTP client [axios](https://axios-http.com/).

> The library is made for [Vue 3.x.x](https://v3.vuejs.org/) and the [Composiotion API](https://v3.vuejs.org/api/composition-api.html).

## Instalation

Install the library and axios with npm.

```bash
npm install axios @baloise/vue-axios
```

## Use plugin

Import the library into your `src/main.ts` file or any other entry point.

```typescript
import { createApp } from 'vue'
import { vueAxios } from '@baloise/vue-axios'
```

Apply the library to the vue app instance. The additional configuration have the type [AxiosRequestConfig](https://axios-http.com/docs/req_config/).

```typescript
const app = createApp(App)

// simple
app.use(vueAxios)

// additional configurations
app.use(vueAxios, {
  baseURL: 'http://api.my-site.com',
})
```

## Interceptors

Use the defined `$axios` instance. More to the intercepters can be found [here](https://axios-http.com/docs/interceptors/).

```typescript
import { $axios } from '@baloise/vue-axios'

// Add a request interceptor
$axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
$axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)
```

## Usage

### Have multiple API's

To access multiple apis in your app it could be help full to create a new axios instance. However, if you only access one api configure it through the plugin options `defaults`.

Export the new instance and use it in any component.

```typescript
import { $axios } from '@baloise/vue-axios'

export const catApi = $axios.create({
  baseURL: 'https://cat-fact.herokuapp.com',
})

export const dogApi = $axios.create({
  baseURL: 'https://dog-fact.herokuapp.com',
})
```

Use the defined api instance in your components with the same interface that axios has.

[Axios API Reference](https://axios-http.com/docs/api_intro/)

```typescript
catApi.get('/facts')

dogApi.post('/facts', {
  fact: 'wuff',
})
```

## Composition API

To use axios with the composition API import the `useAxios` composable function. `useAxios` return reactive values like `isPending` or functions like `request` to execute a HTTP request.

The reactive values gets updated when executing a HTTP request.

```typescript
import { computed, defineComponent } from 'vue'
import { useAxios } from '@baloise/vue-axios'
import { CatApi } from '../api/cat.api'

type CatFacts = { text: string }[]

export default defineComponent({
  setup() {
    const { get, data, isPending, isSuccessful } = useAxios<CatFacts, undefined>(CatApi)

    function callApi() {
      get('/facts')
    }

    return {
      callApi,
      data,
      isPending,
      isSuccessful,
    }
  },
})
```

### useAxios

The `useAxios` function accepts a custom axios instance, otherwise it uses the global `$axios` instance.
The `$axios` instance is defined in the plugin options with the default & interceptor props.

```typescript
import { useAxios } from '@baloise/vue-axios'

useAxios()
useAxios(axiosInstance)
```

#### Reactive State

The `useAxios` function exposes the following reactive state.

```typescript
import { useAxios } from '@baloise/vue-axios'

const {
  data,
  error,
  headers,
  status,
  statusText,
  cancelledMessage,

  // state
  isPending,
  isSuccessful,
  hasFailed,
  isCancelled,
} = useAxios()
```

| State            | Type      | Description                                                       |
| ---------------- | --------- | ----------------------------------------------------------------- |
| data             | `any`     | `data` is the response that was provided by the server.           |
| error            | `any`     | Promise Error.                                                    |
| headers          | `any`     | `headers` the HTTP headers that the server responded with.        |
| status           | `number`  | `status` is the HTTP status code from the server response.        |
| statusText       | `string`  | `statusText` is the HTTP status message from the server response. |
| cancelledMessage | `string`  | `cancelledMessage` is the provided message of the cancel action.  |
| isPending        | `boolean` | If `true` the response of the http call is still pending.         |
| isSuccessful     | `boolean` | If `true` the response successfully arrived.                      |
| hasFailed        | `boolean` | If `true` the response has failed.                                |
| isCancelled      | `boolean` | If `true` the request has been cancelled by the user.             |

#### Functions

The `useAxios` function exposes the following functions.

```typescript
import { useAxios } from '@baloise/vue-axios'

const { request, get, post, put, patch, remove, head, options, cancel } = useAxios()
```

##### request

Similar to the `axios.request` function. Moreover, besides the `AxiosRequestConfig` it also accepts `Promise<RequestArgs>` paramter too. `Promise<RequestArgs>` is the return type of the OpenAPI Codegen ParamCreator.

```typescript
request(config: AxiosRequestConfig)
request(config: Promise<RequestArgs>)
```

##### get, post, put, patch, head, options, remove

Similar to the `axios` functions.

```typescript
get(url[, config])
remove(url[, config])
head(url[, config])
options(url[, config])
post(url[, data[, config]])
put(url[, data[, config]])
patch(url[, data[, config]])
```

##### cancel

Cancels the HTTP request.

```typescript
cancel()
cancel(message: string)
```

## Open API Codegen

If your API uses Swagger and follows the OpenApi guidlines it is possible to generate a typescript axios SDK out of it.

To generate a SDK install the [OpenAPI Generator](https://www.npmjs.com/package/@openapitools/openapi-generator-cli)

```bash
npm add -D @openapitools/openapi-generator-cli
```

Export the `swagger.json` or `swagger.yaml` from your API and run the following command.

```bash
openapi-generator-cli generate -i path-to/swagger.yaml -g typescript-axios -o generated-sources/openapi --additional-properties=supportsES6=true,npmVersion=6.9.0,withInterfaces=true
```

Move the generated SDK code into your project. Then define the base configuration of your API and for each endpoint create the param creator.

```typescript
import { Configuration, UsersApiAxiosParamCreator } from './generated'
import { getToken } from '@baloise/vue-keycloak'

const myApiConfiguration = new Configuration({
  basePath: '/my/api',
  apiKey: async () => {
    const token = await getToken()
    return `Bearer ${token}`
  },
})

export const UsersApi = UsersApiAxiosParamCreator(myApiConfiguration)
```

Import the param creator `UsersApi` into the component and use them with the function `request` to send the HTTP request to the defined API.

```typescript
import { defineComponent, ref } from 'vue'
import { UsersApi } from '../api/my.api'
import { useAxios } from '@baloise/vue-axios'

export default defineComponent({
  setup() {
    const { request } = useAxios()

    async function onButtonClick() {
      await request(UsersApi.getUserUsingGET('7'))
    }

    return { onButtonClick }
  },
})
```

# License

Apache-2.0 Licensed | Copyright © 2021-present Gery Hirschfeld & Contributors
