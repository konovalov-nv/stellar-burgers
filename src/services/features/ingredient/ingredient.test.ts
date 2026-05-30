import { TIngredient } from '@utils-types';
import { ingredientReducer, fetchIngredients } from './ingredient';

describe('ingredient test', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null as string | null
  };

  it('fetchIngredients.pending', () => {
    const state = ingredientReducer(
      initialState,
      fetchIngredients.pending('id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('fetchIngredients.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];

    const state = ingredientReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, 'id', undefined)
    );

    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('fetchIngredients.rejected', () => {
    const state = ingredientReducer(
      initialState,
      fetchIngredients.rejected(new Error('error123'), 'id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('error123');
  });
});
