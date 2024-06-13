import React, { useEffect } from 'react'
import { StyleSheet, View, Text, Image, Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'

function SplashScreen() {
  const navigation = useNavigation()
  const fadeAnim = new Animated.Value(0)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start()

    Speech.speak(
      'Chào mừng bạn đến với ứng dụng đọc sách dành cho người khiếm thị.',
      { language: 'vi' }
    )

    const timer = setTimeout(() => {
      navigation.navigate('UserInfoScreen')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../assets/img/splash.jpg')} // Đường dẫn tới icon ứng dụng
          style={styles.logo}
        />
        <Text style={styles.appName}>
          Ứng dụng hỗ trợ người khiếm thị đọc sách
        </Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '90%',
    height: 150,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center'
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default SplashScreen
