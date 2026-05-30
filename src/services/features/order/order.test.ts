import { TOrder } from '@utils-types';
import { createOrder, fetchOrders, orderReducer } from './order';

const mockCreateOrderResponse = {
  success: true,
  name: 'order 1',
  order: {
    _id: '1',
    status: 'ready',
    name: 'order 1',
    createdAt: '2026-05-30',
    updatedAt: '2026-05-30',
    number: 11,
    ingredients: ['bun', 'kotleta'],

    owner: {
      name: 'User test',
      email: 'test@gmail.com',
      createdAt: '2026-05-30',
      updatedAt: '2026-05-30'
    },
    price: 1234
  }
};
const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'ready',
    name: 'order',
    createdAt: '2026-05-30',
    updatedAt: '2026-05-30',
    number: 12,
    ingredients: ['bun', 'kotleta']
  }
];

describe('order test', () => {
  const initialState = {
    order: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null as string | null,
    currentOrder: null,
    orderRequest: false,
    orderModalData: null
  };

  it('fetchOrders.pending', () => {
    const state = orderReducer(
      initialState,
      fetchOrders.pending('id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('fetchOrders.fulfilled', () => {
    const state = orderReducer(
      initialState,
      fetchOrders.fulfilled(mockOrders, 'id', undefined)
    );

    expect(state.error).toBe(null);
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrders);
  });

  it('fetchOrders.rejected', () => {
    const state = orderReducer(
      initialState,
      fetchOrders.rejected(new Error('fetch order error'), 'id', undefined)
    );

    expect(state.error).toBe('fetch order error');
    expect(state.isLoading).toBe(false);
  });
});

describe('createOrder', () => {
  const initialState = {
    order: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null as string | null,
    currentOrder: null,
    orderRequest: false,
    orderModalData: null
  };

  it('createOrder.pending', () => {
    const state = orderReducer(
      initialState,
      createOrder.pending('id', ['bun', 'kotleta'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBe(null);
  });

  it('createOrder.fulfilled', () => {
    const state = orderReducer(
      initialState,
      createOrder.fulfilled(mockCreateOrderResponse, 'id', ['bun', 'kotleta'])
    );

    expect(state.error).toBe(null);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockCreateOrderResponse.order);
  });

  it('createOrder.rejected', () => {
    const state = orderReducer(
      initialState,
      createOrder.rejected(new Error('fetch order error'), 'id', [
        'bun',
        'kotleta'
      ])
    );

    expect(state.error).toBe('fetch order error');
    expect(state.orderRequest).toBe(false);
  });
});
