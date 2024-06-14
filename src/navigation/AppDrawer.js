import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookStack from './BookStack';
import SettingsScreen from '../screen/SettingsScreen';
import PlaylistScreen from '../screen/PlaylistScreen';
import SearchScreen from '../screen/SearchScreen';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={BookStack}/>
      <Drawer.Screen name="PlayList" component={PlaylistScreen}/>
      <Drawer.Screen name="Search" component={SearchScreen}/>
      <Drawer.Screen name="Settings" component={SettingsScreen}/>
    </Drawer.Navigator>
  );
};
// options={{ headerShown: false }}

export default AppDrawer;
