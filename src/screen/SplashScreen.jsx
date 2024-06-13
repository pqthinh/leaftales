import React, { useEffect, useRef } from 'react'
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Speech from 'expo-speech'

function SplashScreen() {
  const navigation = useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start()
  }, [fadeAnim])

  useEffect(() => {
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
      <ImageBackground
        source={require('../assets/img/splash.jpg')} // Đường dẫn tới ảnh nền
        style={styles.backgroundImage}
        resizeMode='stretch'
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.content}>
            <Text style={styles.appName}>
              Ứng dụng hỗ trợ người khiếm thị đọc sách
            </Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Nền mờ cho chữ nổi bật
    padding: 20,
    borderRadius: 10
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  }
})

export default SplashScreen
