import { rootReducer } from './store';

describe('rootReducer test', () => {
  it('Начальное состояние приложения', () => {
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual({
      user: {
        user: null,
        isAuth: false,
        isLoading: false,
        error: undefined
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      feed: {
        data: null,
        isLoading: false,
        error: null
      },
      order: {
        order: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
        currentOrder: null,
        orderRequest: false,
        orderModalData: null
      }
    });
  });
});
