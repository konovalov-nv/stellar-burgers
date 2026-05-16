import {
  getOrderByNumberApi,
  getOrdersApi,
  getFeedsApi,
  orderBurgerApi,
  TNewOrderResponse,
  TNewOrder
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface OrdersState {
  order: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
}

const initialState: OrdersState = {
  order: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  orderRequest: false,
  orderModalData: null
};

export const fetchOrders = createAsyncThunk<TOrder[], void>(
  'order/getOrders',
  async () => getOrdersApi()
);

export const fetchPublicFeed = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void
>('order/fetchPublicFeed', async () => {
  const data = await getFeedsApi(); // { orders, total, totalToday, success }
  return {
    orders: data.orders,
    total: data.total,
    totalToday: data.totalToday
  };
});

export const createOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  'order/createOrder',
  async (ingredients) => orderBurgerApi(ingredients)
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);
    if (!data.success || !data.orders.length) {
      throw new Error('Заказ не найден');
    }
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Публичная лента (/feed)
      .addCase(fetchPublicFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicFeed.fulfilled, (state, action) => {
        state.order = action.payload.orders;
        state.total = action.payload.total; // ✅ Сохраняем
        state.totalToday = action.payload.totalToday; // ✅ Сохраняем
        state.isLoading = false;
      })
      .addCase(fetchPublicFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      })

      // Приватные заказы (/profile/orders)
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      })

      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка создания заказа';
      })

      // Заказ по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderData = (state: RootState) => state.order.order;
export const { clearOrderModal } = orderSlice.actions;
export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
