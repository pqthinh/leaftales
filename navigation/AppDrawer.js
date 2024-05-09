import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookStack from './BookStack'; // Replace with your routes component
// import HomeScreen from './HomeScreen'; // Your home screen for browsing books
// import DownloadsScreen from './DownloadsScreen'; // Screen to display downloaded books (optional)
import SettingsScreen from '../screen/SettingsScreen'; // Screen for app settings

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={BookStack} />
      {/* <Drawer.Screen name="Downloads" component={DownloadsScreen} /> */}
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
