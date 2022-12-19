import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {IElement} from "../../components/color-alchemy/ColorAlchemy";
import {assignElements, calculateScaledColor, colorsCombination, colorsDifference, createArray} from "../../utils";
import {SettingsState} from "../settings/settingsSlice";
import {Element} from '../../enum';

export interface ClosestColor {
    color: string;
    diff: number;
    position: number;
}

export interface ElementState {
    elements: IElement[];
    targetColor: string;
    closestColor: ClosestColor;
}

const initialState: ElementState = {
    elements: [],
    targetColor: '',
    closestColor: {color: '', diff: 0, position: 0}
};

export const elementSlice = createSlice({
    name: 'elements',
    initialState,
    reducers: {
        addArray: (state, data: PayloadAction<SettingsState>) => {
            const tilesNumber = data.payload.height * data.payload.width;
            const sourcesNumber = (data.payload.height * 2) + (data.payload.width * 2);
            const corners = 4;
            const elementsTotal = tilesNumber + sourcesNumber + corners;

            document.documentElement.style.setProperty('--grid-external-rows', String(data.payload.height + 2));
            document.documentElement.style.setProperty('--grid-internal-rows', String(data.payload.height));
            document.documentElement.style.setProperty('--grid-external-columns', String(data.payload.width + 2));
            document.documentElement.style.setProperty('--grid-internal-columns', String(data.payload.width));

            return {
                ...state,
                elements: assignElements(createArray(elementsTotal), elementsTotal, data.payload.height, data.payload.width)
            };

        },
        modifyElement: (state, element: PayloadAction<IElement>) => {
            const elementPosition = element.payload.position;
            const changeColor = element.payload.color;

            const elementsCopy = [...state.elements];
            elementsCopy[elementPosition] = {...state.elements[elementPosition], color: changeColor};

            return {
                ...state,
                elements: elementsCopy
            }
        },
        modifyColumn: (state, columnInfo: PayloadAction<{ h: number, w: number, source: IElement, isReverse: boolean }>) => {
            const h = columnInfo.payload.h;
            const w = columnInfo.payload.w;
            const source = columnInfo.payload.source;
            const isReversed = columnInfo.payload.isReverse;
            let combinedColors;
            const elementsCopy = [...state.elements];

            for (let i = 1; i < h + 1; i++) {
                const index = (w + 2) * i;
                const sourcePosition = source.position + (!isReversed ? index : - index);
                const columnColorFactor = (h + 1 - i) / (h + 1);
                const scaledColor = calculateScaledColor(source.color, columnColorFactor);

                if (source.color !== 'rgb(0, 0, 0)') {
                    combinedColors = colorsCombination([state.elements[sourcePosition].color, scaledColor]);
                } else {
                    combinedColors = 'rgb(0, 0, 0)';
                }

                elementsCopy[sourcePosition] = {...state.elements[sourcePosition], color: combinedColors ? combinedColors : scaledColor};

                combinedColors = null;
            }

            return {
                ...state,
                elements: elementsCopy
            }
        },
        modifyRow: (state, rowInfo: PayloadAction<{ w: number, source: IElement, isReversed: boolean}>) => {
            const w = rowInfo.payload.w;
            const source = rowInfo.payload.source;
            const isReversed = rowInfo.payload.isReversed;
            let combinedColors;
            const elementsCopy = [...state.elements];

            for (let i = 1; i < w; i++) {
                const sourcePosition = source.position + (!isReversed ? i : - i)
                const rowColorFactor = (w + 1 - (i)) / (w + 1);
                const scaledColor = calculateScaledColor(source.color, rowColorFactor);

                if (source.color !== 'rgb(0, 0, 0)') {
                    combinedColors = colorsCombination([state.elements[sourcePosition].color, scaledColor]);
                } else {
                    combinedColors = 'rgb(0, 0, 0)';
                }

                elementsCopy[sourcePosition] = {...state.elements[sourcePosition], color: combinedColors ? combinedColors : scaledColor};

                combinedColors = null;
            }
            return {
                ...state,
                elements: elementsCopy
            }
        },
        getColors: (state, targetColor: PayloadAction<string>) => {
            const filterTiles = [...state.elements].filter(e => e.element === Element.Tile);
            const resultColors: ClosestColor[] = filterTiles.map((e: IElement) => {
                return { color: e.color, diff: colorsDifference(targetColor.payload, e.color), position: e.position};
            });
            return {
                ...state,
                closestColor: resultColors.reduce((acc, curr) => Math.abs(curr.diff - 10) < Math.abs(acc.diff - 10) ? curr : acc)
            };
        },
        clearSuccessColor: (state) => {
            return {
                ...state,
                closestColor: { color: '', diff: 1000, position: 0}
            }
        },
        restartGame: (state) => {
            return {
                ...state,
                elements: [...state.elements].map((e: IElement) => {
                    return {...e, color: 'rgb(0, 0, 0)'};
                })
            }
        }
    }
});

export const {
    addArray,
    modifyElement,
    modifyColumn,
    modifyRow,
    getColors,
    restartGame,
    clearSuccessColor
} = elementSlice.actions;

export const selectElementState = (state: RootState) => state.elements;
export const selectClosestColor = (state: RootState) => state.elements.closestColor;
export const selectElements = (state: RootState) => state.elements.elements;

export default elementSlice.reducer;

