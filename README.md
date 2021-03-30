# @baloise/vue-axios

Wrapper for the axios package to use with the composition api of Vue 3

## Instalation

Install the [axios](https://axios-http.com/) package and our wrapper library.

```bash
npm install axios @baloise/vue-axios
```

## Use plugin

```typescript
import { createApp } from 'vue'
import { vueAxios } from '@baloise/vue-axios'
import App from './app/App.vue'

createApp(App)
  .use(vueAxios, {
    // defaults: AxiosRequestConfig
    // interceptors: {
    //   request: AxiosInterceptorManager<AxiosRequestConfig>;
    //   response: AxiosInterceptorManager<AxiosResponse>;
    // }
  })
  .mount('#app')
```

## Create new instance

```typescript
import { $http } from '@baloise/vue-axios'

export const CatApi = $http.create({
  baseURL: 'https://cat-fact.herokuapp.com',
})

CatApi.get('/facts') ...
```

## Composable

```typescript
import { computed, defineComponent } from 'vue'
import { useAxios } from '@baloise/vue-axios'
import { CatApi } from '../api/cat.api'

type CatFacts = { text: string }[]

export default defineComponent({
  setup() {
    const { send, data, isPending, isSuccessful } = useHttp<CatFacts, undefined>(CatApi)

    function callApi() {
      send({ url: '/facts' })
    }

    const response = computed(() => data.value?[0].text

    return {
      callApi,
      response,
      isPending,
      isSuccessful,
    }
  },
})
```
