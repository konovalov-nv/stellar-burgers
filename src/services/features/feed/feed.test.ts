import { TOrder, TOrdersData } from '@utils-types';
import { feedReducer, getFeed } from './feed';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'order 1',
    createdAt: '2026-05-30',
    updatedAt: '2026-05-30',
    number: 10,
    ingredients: ['bun', 'kotleta']
  }
];

const mockFeed: TOrdersData = {
  orders: mockOrders,
  total: 25,
  totalToday: 50
};

describe('feed test', () => {
  const initialState = {
    data: null,
    isLoading: false,
    error: null as string | null
  };

  it('getFeed.pending', () => {
    const state = feedReducer(initialState, getFeed.pending('id', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('getFeed.fulfilled', () => {
    const state = feedReducer(
      initialState,
      getFeed.fulfilled(mockFeed, 'id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.data).toEqual(mockFeed);
  });

  it('getFeed.rejected', () => {
    const state = feedReducer(
      initialState,
      getFeed.rejected(new Error('fetchFeed error'), 'id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('fetchFeed error');
  });
});
