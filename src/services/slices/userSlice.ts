import {
  forgotPasswordApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface IUserState {
  status: string;
  isLaunched: boolean;
  registerError: string | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loginError: string | null;
  logoutError: string | null;
  ordersError: string | null;
  user: TUser | null;
  orders: TOrder[];
}

export interface IResetPassword {
  password: string;
  token: string;
}

export type TEmailData = {
  email: string;
};

export const registerUserThunk = createAsyncThunk(
  'user/registerUserApi',
  async ({ name, email, password }: TRegisterData) => {
    const result = await registerUserApi({ name, email, password });

    if (!result.success) {
      return Promise.reject(result);
    }
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/loginUserApi',
  async ({ email, password }: TLoginData) => {
    const result = await loginUserApi({ email, password });

    if (!result.success) {
      return Promise.reject(result);
    }
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const logoutUserThunk = createAsyncThunk('user/logoutApi', async () => {
  const result = await logoutApi();

  if (!result.success) {
    return Promise.reject(result);
  }
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return result;
});

export const getUserThunk = createAsyncThunk('user/getUserApi', async () => {
  const result = await getUserApi();
  return result.user;
});

export const updateUserThunk = createAsyncThunk(
  'user/updateUserApi',
  async (user: TRegisterData) => {
    const result = await updateUserApi(user);
    if (!result.success) {
      return Promise.reject(result);
    }

    return result.user;
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPasswordApi',
  async ({ password, token }: IResetPassword) => {
    const result = await resetPasswordApi({ password, token });
    if (!result.success) {
      return Promise.reject(result);
    }
    return result;
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPasswordApi',
  async ({ email }: TEmailData) => {
    const result = await forgotPasswordApi({ email });
    if (!result.success) {
      return Promise.reject(result);
    }
    return result;
  }
);

export const getOrdersThunk = createAsyncThunk(
  'user/getOrdersApi',
  getOrdersApi
);

export const initialState: IUserState = {
  status: 'idle',
  isLaunched: false,
  registerError: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginError: null,
  logoutError: null,
  ordersError: null,
  user: null,
  orders: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    launch: (state) => {
      state.isLaunched = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.status = 'loading';
        state.registerError = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.user = null;
        state.registerError =
          action.error.message || 'Не удалось зарегестрировать пользователя';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.status = 'completed';
        state.user = action.payload;
        state.registerError = null;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.status = 'loading';
        state.loginError = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.isAuthChecked = true;
        state.loginError = action.error.message || 'Ошибка авторизации';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.status = 'completed';
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.loginError = null;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.status = 'loading';
        state.logoutError = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.logoutError =
          action.error.message || 'Не удалось выйти из учётной записи';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.status = 'logout success';
        state.user = null;
        state.logoutError = null;
      })

      .addCase(getUserThunk.pending, (state) => {
        state.status = 'loading';
        state.loginError = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.isLaunched = true;
        state.isAuthChecked = true;
        state.loginError =
          action.error.message || 'Не удалось получить данные о пользователе';
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.status = 'received';
        state.user = action.payload;
        state.isLaunched = true;
        state.isAuthChecked = true;
        state.loginError = null;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.status = 'loading';
        state.loginError = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.isAuthChecked = true;
        state.isLaunched = true;
        state.loginError =
          action.error.message || 'Не удалось обновить данные о пользователе';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.status = 'received';
        state.user = action.payload;
        state.isLaunched = true;
        state.isAuthChecked = true;
        state.loginError = null;
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.status = 'loading';
        state.loginError = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.loginError = action.error.message || 'Не удалось сбросить пароль';
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.status = 'password reset';
        state.loginError = null;
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.status = 'loading';
        state.loginError = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.loginError =
          action.error.message || 'Не удалось восстановить пароль';
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.status = 'password recovery';
        state.loginError = null;
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.status = 'loading';
        state.ordersError = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.status = 'rejected';
        state.ordersError =
          action.error.message || 'Не удалось получить данные о заказах';
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.status = 'orders received';
        state.orders = action.payload;
        state.ordersError = null;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsLaunched: (state) => state.isLaunched,
    selectUserOrders: (state) => state.orders,
    selectStatus: (state) => state.status,
    selectRegisterError: (state) => state.registerError,
    selectLoginError: (state) => state.loginError,
    selectOrdersError: (state) => state.ordersError,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAuthChecked: (state) => state.isAuthChecked
  }
});

export const {
  selectUser,
  selectIsLaunched,
  selectUserOrders,
  selectIsAuthChecked,
  selectOrdersError,
  selectIsAuthenticated,
  selectRegisterError,
  selectStatus,
  selectLoginError
} = userSlice.selectors;

export const { launch } = userSlice.actions;
export const userReducer = userSlice.reducer;
