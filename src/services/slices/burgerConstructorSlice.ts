import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import exp from 'constants';
import { getCookie } from '../../utils/cookie';
import { orderBurgerApi } from '@api';

export interface IBurgerConstructorState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  status: string;
}

export const initialState: IBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null,
  status: 'idle'
};

export const orderBurgerThunk = createAsyncThunk(
  'burgerConstructor/orderBurgerApi',
  async (ingredients: string[]) => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return Promise.reject('User is not authorized');
    }

    const result = await orderBurgerApi(ingredients);

    if (!result.success) {
      return Promise.reject(result);
    }

    return result;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },

    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: uuidv4() } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );

      if (index > 0) {
        const [el] = state.constructorItems.ingredients.splice(index, 1);
        state.constructorItems.ingredients.splice(index - 1, 0, el);
      }
    },

    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );

      if (index < state.constructorItems.ingredients.length - 1) {
        const [el] = state.constructorItems.ingredients.splice(index, 1);
        state.constructorItems.ingredients.splice(index + 1, 0, el);
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.status = 'loading';
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.status = 'order created';
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        state.error = null;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  },

  selectors: {
    selectBun: (state) => state.constructorItems.bun,
    selectIngredients: (state) => state.constructorItems.ingredients,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData
  }
});

export const {
  selectBun,
  selectIngredients,
  selectOrderRequest,
  selectOrderModalData
} = burgerConstructorSlice.selectors;

export const {
  setBun,
  setOrderModalData,
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
