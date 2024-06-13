import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screen/SplashScreen';
import UserInfoScreen from '../screen/UserInfoScreen';

const Stack = createStackNavigator();

const SplashStack = () => {
  return (
    <Stack.Navigator headerShown="none">
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default SplashStack;
