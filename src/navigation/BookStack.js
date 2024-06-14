import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListBook from '../screen/ListBookScreen';
import BookReader from '../screen/BookReader';
import SearchScreen from '../screen/SearchScreen';
import PlaylistScreen from '../screen/PlaylistScreen';
import BookmarkScreen from '../screen/BookmarkScreen';
import HomeScreen from '../screen/HomeScreen';
import SplashScreen from '../screen/SplashScreen';
import SettingsScreen from '../screen/SettingsScreen';
import UserInfoScreen from '../screen/UserInfoScreen';

const Stack = createStackNavigator();

const BookStack = () => {
  return (
    <Stack.Navigator headerShown="none">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ListBook" component={ListBook} options={{ headerShown: false }}/>
      <Stack.Screen name="BookDetail" component={BookReader} options={{ headerShown: false }}/>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="PlayList" component={PlaylistScreen} />
      <Stack.Screen name="Bookmark" component={BookmarkScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="SettingScreen" component={SettingsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default BookStack;
