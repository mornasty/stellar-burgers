import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  status: string;
  ingredients: TIngredient[];
  error: string | null;
}

const initialState: IngredientsState = {
  status: 'idle',
  ingredients: [],
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredientsApi',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || 'error';
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.status = 'received';
        state.ingredients = action.payload;
        state.error = null;
      });
  },
  selectors: {
    selectAllIngredients: (state) => state.ingredients,
    selectIngredientsInfo: (state) => ({
      status: state.status,
      error: state.error
    }),
    selectIngredientsStatus: (state) => state.status,
    selectBuns: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'bun'),

    selectMains: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    selectSauces: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'sauce')
  }
});

export const {
  selectAllIngredients,
  selectIngredientsStatus,
  selectBuns,
  selectMains,
  selectSauces,
  selectIngredientsInfo
} = ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
