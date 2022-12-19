import React, {useEffect} from 'react';
import './Sources.css';
import Tooltip from '@mui/material/Tooltip';
import {IElement} from "../color-alchemy/ColorAlchemy";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {decrement, selectCount} from "../../features/counter/counterSlice";
import {
    getColors,
    modifyColumn,
    modifyElement,
    modifyRow,
    selectElements
} from "../../features/element/elementSlice";
import {
    selectHeight,
    selectMaxMoves,
    selectTarget,
    selectWidth
} from "../../features/settings/settingsSlice";
import {getTooltip} from "../../utils";

interface Props {
    source: IElement;
}

export const Source: React.FC<Props> = ({source}: Props) => {
    const dispatch = useAppDispatch();
    const height = useAppSelector(selectHeight);
    const width = useAppSelector(selectWidth);
    const maxMoves = useAppSelector(selectMaxMoves);
    const target = useAppSelector(selectTarget);
    const count = useAppSelector(selectCount);
    const elements = useAppSelector(selectElements);

    const toolTip = getTooltip(source.color);

    const setCursor = (maxMoves: number, count: number) => {
        return count >= maxMoves - 2 ? 'pointer_cursor' : 'default_cursor';
    }

    const handleClick = (currentTarget: IElement) => {
        if (count >= maxMoves - 2) {
            let colorChanged = {...currentTarget, color: ''};

            if (count === maxMoves) colorChanged.color = 'rgb(255, 0, 0)';
            if (count === maxMoves - 1) colorChanged.color = 'rgb(0, 255, 0)';
            if (count === maxMoves - 2) colorChanged.color = 'rgb(0, 0, 255)';

            dispatch(modifyElement(colorChanged));

            changeColors(colorChanged);

            dispatch(decrement());
        }
    }
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const draggedElementId: number = Number(event.dataTransfer.getData('text'));
        const draggedElementColor: string = elements[draggedElementId].color;
        const droppedElement: IElement = elements[Number(event.currentTarget.id)];

        let colorChanged = {...droppedElement, color: draggedElementColor};

        dispatch(modifyElement(colorChanged));

        changeColors(colorChanged);

        dispatch(decrement());
    }
    useEffect(() => {

    })

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const changeColors = (changeElement: IElement) => {
        for (let j = 1; j < (height + 2); j++) {
            if (changeElement.position === (width + 2) * j) {
                dispatch(modifyRow({w: width, source: changeElement, isReversed: false}));
                break;
            }
            if (changeElement.position === (width + 2) * j - 1) {
                dispatch(modifyRow({w: width, source: changeElement, isReversed: true}));
                break;
            }
        }
        if (changeElement.position < width + 2) {
            dispatch(modifyColumn({h: height, w: width, source: changeElement, isReverse: false}));
        }
        if (changeElement.position > (width + 2) * (height + 2) - (width + 2)) {
            dispatch(modifyColumn({h: height, w: width, source: changeElement, isReverse: true}));
        }

        const targetColor = `rgb(${target.join(', ')})`;
        dispatch(getColors(targetColor));
    }

    return <Tooltip title={toolTip}>
        <div id={String(source.position)}
             onDragOver={enableDropping}
             onDrop={handleDrop} className={`element source ${setCursor(maxMoves, count)}`}
             style={{color: 'white' ,backgroundColor: source.color ? source.color : elements[source.position].color}}
             onClick={() => handleClick(source)}>
        </div>
    </Tooltip>
};
