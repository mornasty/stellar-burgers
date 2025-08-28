import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { ordersReducer } from './slices/ordersSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { userReducer } from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer
});
