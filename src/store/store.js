import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './bookReducer'; // Your bookReducer

const store = configureStore({
    reducer: bookReducer, 
});

export default store;
