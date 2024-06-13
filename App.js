import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AppDrawer from './src/navigation/AppDrawer'
import { VoiceControlComponent } from './src/component/VoiceControl'
import { View, LogBox } from 'react-native'
import { Provider } from 'react-redux'
import store, { persistor } from './src/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import useCache from './src/hooks/useCache'
import SplashStack from './src/navigation/SplashStack'
LogBox.ignoreAllLogs()

export default function App() {
  const { set, get } = useCache
  const userInfo = get('@app/get_user_info')
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          {userInfo && userInfo.name ? (
            <>
              <AppDrawer />
              <View style={{ height: 80 }}>
                <VoiceControlComponent />
              </View>
            </>
          ) : (
            <SplashStack />
          )}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}
