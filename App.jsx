import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BookStack from './navigation/BookStack'; // Replace with your routes component

export default function App() {
  return (
    <NavigationContainer>
      <BookStack />
    </NavigationContainer>
  );
}
