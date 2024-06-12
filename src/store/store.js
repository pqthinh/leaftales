import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookReducer from './bookReducer';

const persistConfig = {
  key: '@root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistConfig, bookReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
export const persistor = persistStore(store);