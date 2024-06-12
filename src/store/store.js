import { configureStore } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';
import bookReducer from './bookReducer';

// const rootReducer = combineReducers({
//     book: bookReducer,
// });

const store = configureStore({
    reducer: {
        bookReducer
    }
});

export default store;
