import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ingredientReducer } from './features/ingredient';
import { constructorReducer } from './features/constructor';
import { orderReducer } from './features/order';
import { userReducer } from './features/user';
import { feedReducer } from './features/feed';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
