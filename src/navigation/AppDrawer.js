import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookStack from './BookStack';
import SettingsScreen from '../screen/SettingsScreen';
import RecordingAudio from '../screen/RecordingAudio';
import ExpoVoice from '../screen/ExpoVoice';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={BookStack} options={{ headerShown: false }}/>
      <Drawer.Screen name="Downloads" component={RecordingAudio} options={{ headerShown: false }}/>
      <Drawer.Screen name="Expo voice" component={ExpoVoice} options={{ headerShown: false }}/>
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
    </Drawer.Navigator>
  );
};

export default AppDrawer;
