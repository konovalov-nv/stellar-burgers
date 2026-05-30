import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  constructorReducer
} from './constructor';

const mockBun = {
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
};

const mockFilling = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructor test', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('Добавить булку', () => {
    const newState = constructorReducer(initialState, addIngredient(mockBun));

    expect(newState.bun).toMatchObject({
      ...mockBun,
      id: expect.any(String)
    });

    expect(newState.ingredients).toEqual([]);
  });

  it('Добавить начинку', () => {
    const newState = constructorReducer(
      initialState,
      addIngredient(mockFilling)
    );

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject({
      ...mockFilling,
      id: expect.any(String)
    });
  });

  it('Удалить ингредиент из конструктора', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockFilling, id: 'test-id-1' },
        { ...mockSauce, id: 'test-id-2' }
      ]
    };

    const newState = constructorReducer(
      stateWithIngredients,
      removeIngredient(0)
    );

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mockSauce,
      id: 'test-id-2'
    });
  });

  it('Менять порядок ингредиентов в начинке', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockFilling, id: 'test-id-1' },
        { ...mockSauce, id: 'test-id-2' }
      ]
    };

    const newState = constructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 0, direction: 'down' })
    );

    expect(newState.ingredients[0]).toEqual({
      ...mockSauce,
      id: 'test-id-2'
    });

    expect(newState.ingredients[1]).toEqual({
      ...mockFilling,
      id: 'test-id-1'
    });
  });
});
