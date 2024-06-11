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
      <Drawer.Screen name="Home" component={BookStack} />
      <Drawer.Screen name="Downloads" component={RecordingAudio} />
      <Drawer.Screen name="Expo voice" component={ExpoVoice} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
