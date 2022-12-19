import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    startCounter: (state, maxMoves: PayloadAction<number>) => {
      return {
        ...state,
        value: maxMoves.payload
      }
    },
    decrement: (state) => {
      return {
        ...state,
        value: state.value - 1
      }
    },
  }
});

export const { startCounter, decrement } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
