import React, { useState } from 'react'
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useCache from '../hooks/useCache' // Assuming you're using React Navigation

const SettingsScreen = () => {
  const navigation = useNavigation()
  const { clear } = useCache

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f4f4f4' : '#f4f4f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AboutUs')}
      >
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await clear()
          navigation.navigate('SplashScreen')
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  heading: {
    fontSize: 24,
    marginBottom: 10
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  settingLabel: {
    fontSize: 16
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center'
  }
})

export default SettingsScreen
