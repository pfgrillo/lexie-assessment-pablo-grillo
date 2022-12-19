import {Element} from "./enum";
import {IElement} from "./components/color-alchemy/ColorAlchemy";

export const createArray = (elementsTotal: number): IElement[] => {
    const grid: IElement[] = [];
    for( let i = 0; i < elementsTotal; i++ ) grid.push(
        { position: i, element: Element.Tile, color: 'rgb(0, 0, 0)' }
    );
    return grid;
};

export const assignElements = (arraySize: IElement[], elementsTotal: number, h: number, w: number) => {
    return arraySize.map((e: IElement, i: number) => {
        let cornerElement: IElement = { position: e.position, element: Element.Corner, color: ''};
        let sourceElement: IElement = { position: e.position, element: Element.Source, color: 'rgb(0, 0, 0)' };
        // Corners
        if (i === 0) return cornerElement;
        if (i === w + 1) return cornerElement;
        if (i === elementsTotal - w - 2) return cornerElement;
        if (i === elementsTotal - 1) return cornerElement;
        // First row of sources
        if (i <= w + 2) return sourceElement;
        // Last row of sources
        if (i > elementsTotal || i > elementsTotal - w - 2) return sourceElement;
        // Source columns
        for (let j = 1; j < (h + 1); j++) {
            // Left column
            if (i === (j * w) + (2 * j)) return sourceElement;
            // Right column
            if (i === ((j + 1) * w) + (2 * j + 1)) return sourceElement;
        }
        return e;
    });
};

export const getTooltip = (color: string) => color.slice(color.indexOf('(') + 1, color.indexOf(')'));

export const calculateScaledColor = (color: string, colorFactor: number) => {
    const rgb = getRGBComposition(color).map(rgb => Number(rgb * colorFactor));
    return `rgb(${rgb.join(', ')})`;
}

export const getRGBComposition = (color: string): number[] => {
    const splitRGB = color?.slice(color.indexOf('(') + 1, color.indexOf(')')).split(', ');
    return splitRGB.map(rgb => Number(rgb));
};

export const colorsDifference = (targetColor: string, createdColor: string) => {
    const targetRGB = getRGBComposition(targetColor);
    const createdRGB = getRGBComposition(createdColor);

    const sqrDiff = (el1: number, el2: number) => (el1 - el2) * (el1 - el2);

    return (1 / 255) * (1 / Math.sqrt(3)) * Math.sqrt(
        sqrDiff(targetRGB[0], createdRGB[0]) +
        sqrDiff(targetRGB[1], createdRGB[1]) +
        sqrDiff(targetRGB[2], createdRGB[2])) * 100;
};

export const colorsCombination = (colors: string[]): string => {
    const colorsRGB = colors.map(color => getRGBComposition(color));

    const reduceRGB = (index: number) => colorsRGB.map(color => color[index]).reduce((acc, curr) => {
        return acc + curr;
    }, 0);

    const r = reduceRGB(0);

    const g = reduceRGB(1);

    const b = reduceRGB(2);

    const f = 255 / Math.max(r, g, b, 255);

    return `rgb(${Number(r * f).toFixed(2)}, ${Number(g * f).toFixed(2)}, ${Number(b * f).toFixed(2)})`;
};

export const combineColors = (baseColor: string, scaledColor: string) => {
    return colorsCombination([baseColor, scaledColor]);
}
