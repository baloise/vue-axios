import { vueAxios } from './plugin'
import { $axios } from './axios'

describe('plugin', () => {
  let appMock: any

  beforeEach(() => {
    appMock = {
      config: {
        globalProperties: {
          $axios: undefined,
        },
      },
    }
  })

  test('should set axios as globalProperties', async () => {
    await vueAxios.install(appMock)

    expect(appMock.config.globalProperties.$axios).toBeDefined()
  })

  test('should set override default config', async () => {
    await vueAxios.install(appMock, {
      baseURL: 'https://stackoverflow.com',
    })

    expect($axios.defaults.baseURL).toBe('https://stackoverflow.com')
  })
})
