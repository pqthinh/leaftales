import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

import { CheckExpireCache, ExpiredTime } from '../util/config'

export default {
  set: async function (key, data, expired = ExpiredTime) {
    try {
      const dx = {
        data,
        expired: new Date().getTime() + expired
      }

      const json = JSON.stringify(dx)
      await AsyncStorage.setItem(key, json)
    } catch (error) {
      console.log('STORAGE SET]Error->', error)
    }
  },
  get: async function (key) {
    try {
      const json = await AsyncStorage.getItem(key)
      const dx = JSON.parse(json)
      if (dx) {
        const expired = new Date(dx.expired)

        if (expired < new Date() && CheckExpireCache) {
          return
        }
        return dx?.data||""
      }

      return {}
    } catch (error) {
      console.log('STORAGE GET]Error->', error)
    }
  },
  clear: async function () {
    try {
      const keys = await AsyncStorage.getAllKeys()

      if (Platform.OS === 'android') {
        await AsyncStorage.clear()
        return
      }

      await AsyncStorage.multiRemove(keys)
    } catch (error) {
      console.log('[STORAGE CLEAR]Error->', error)
    }
  }
}
