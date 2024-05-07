import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListBook from '../screen/ListBookScreen';
import BookReader from '../screen/BookReader';

const Stack = createStackNavigator();

const BookStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListBook" component={ListBook} />
      <Stack.Screen name="BookDetail" component={BookReader} />
    </Stack.Navigator>
  );
};

export default BookStack;
