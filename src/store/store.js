import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk'; // Import thunk nếu bạn vẫn sử dụng nó
import bookReducer from './bookReducer'; // Đảm bảo đường dẫn đến bookReducer của bạn

const persistConfig = {
  key: '@root',
  storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, bookReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export const persistor = persistStore(store);
