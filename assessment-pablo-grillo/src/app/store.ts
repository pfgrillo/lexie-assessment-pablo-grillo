import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import elementReducer from '../features/element/elementSlice';
import settingsSlice from "../features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    counter: counterReducer,
    elements: elementReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
