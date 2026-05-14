import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';
import { v4 as uuid } from 'uuid';
import { createOrder } from './order';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare(ingredient) {
        return {
          payload: {
            ...ingredient,
            id: uuid()
          }
        };
      }
    },

    removeIngredient(state, action: PayloadAction<number>) {
      state.ingredients.splice(action.payload, 1);
    },

    moveIngredient(
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) {
      const { index, direction } = action.payload;
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= state.ingredients.length ||
        index < 0 ||
        index >= state.ingredients.length
      ) {
        return;
      }

      [state.ingredients[index], state.ingredients[newIndex]] = [
        state.ingredients[newIndex],
        state.ingredients[index]
      ];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const constructorReducer = constructorSlice.reducer;
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
export const { removeIngredient, addIngredient, moveIngredient } =
  constructorSlice.actions;
