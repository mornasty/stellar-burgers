import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export interface IOrdersState {
  statusAll: string;
  statusCurrent: string;
  allOrders: TOrder[];
  currentOrder: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: IOrdersState = {
  statusAll: 'idle',
  statusCurrent: 'idle',
  error: null,
  allOrders: [],
  currentOrder: [],
  total: 0,
  totalToday: 0
};

export const getFeedsThunk = createAsyncThunk<TOrdersData>(
  'orders/getFeedsApi',
  async () => {
    const result = await getFeedsApi();
    return result;
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrderByNumberApi',
  async (number: number) => {
    const result = await getOrderByNumberApi(number);
    return result.orders;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.statusAll = 'loading';
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.statusAll = 'rejected';
        state.error =
          action.error.message || 'Не удалось получить информацию о заказах';
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.statusAll = 'received';
        state.allOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.statusCurrent = 'loading';
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.statusCurrent = 'rejected';
        state.error =
          action.error.message || 'Не удалось получить информацию о заказе';
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.statusCurrent = 'received';
        state.currentOrder = action.payload;
        state.error = null;
      });
  },
  selectors: {
    selectAllOrders: (state) => state.allOrders,
    selectCurrentOrder: (state) => state.currentOrder,
    selectStatusAll: (state) => state.statusAll,
    selectStatusCurrent: (state) => state.statusCurrent,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday
  }
});

export const {
  selectAllOrders,
  selectCurrentOrder,
  selectStatusAll,
  selectStatusCurrent,
  selectTotal,
  selectTotalToday
} = ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;
