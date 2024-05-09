import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListBook from '../screen/ListBookScreen';
import BookReader from '../screen/BookReader';
import SearchScreen from '../screen/SearchScreen';
import PlaylistScreen from '../screen/PlaylistScreen';
import BookmarkScreen from '../screen/BookMarkScreen';

const Stack = createStackNavigator();

const BookStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListBook" component={ListBook} />
      <Stack.Screen name="BookDetail" component={BookReader} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="PlayList" component={PlaylistScreen} />
      <Stack.Screen name="Bookmark" component={BookmarkScreen} />
    </Stack.Navigator>
  );
};

export default BookStack;
