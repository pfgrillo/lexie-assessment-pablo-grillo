import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../../app/store';
import {startCounter} from "../counter/counterSlice";
import {addArray} from "../element/elementSlice";

export interface SettingsState {
    userId: number;
    height: number;
    width: number;
    maxMoves: number;
    target: number[];
}

const initialState: SettingsState = {
    userId: 0,
    height: 0,
    width: 0,
    maxMoves: 0,
    target: []
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        initialDataSetting: (state, data: PayloadAction<SettingsState>) => {
            return {
                ...state,
                userId: data.payload.userId,
                height: data.payload.height,
                width: data.payload.width,
                maxMoves: data.payload.maxMoves,
                target: data.payload.target
            }
        },
        restartDataSetting: (state, data: PayloadAction<SettingsState>) => {
            return {
                ...state,
                height: data.payload.height,
                width: data.payload.width,
                maxMoves: data.payload.maxMoves,
                target: data.payload.target
            }
        }
    }
});

export const sideEffectFetchNewData = () => (dispatch: AppDispatch) => {
    fetch("http://localhost:9876/init")
        .then((res) => res.json())
        .then((data: SettingsState) => {
            dispatch(restartDataSetting(data));
            dispatch(addArray(data));
            dispatch(startCounter(data.maxMoves));
        });

};

export const { initialDataSetting, restartDataSetting } = settingsSlice.actions;

export const selectUserId = (state: RootState) => state.settings.userId;
export const selectHeight = (state: RootState) => state.settings.height;
export const selectWidth = (state: RootState) => state.settings.width;
export const selectMaxMoves = (state: RootState) => state.settings.maxMoves;
export const selectTarget = (state: RootState) => state.settings.target;

export default settingsSlice.reducer;
