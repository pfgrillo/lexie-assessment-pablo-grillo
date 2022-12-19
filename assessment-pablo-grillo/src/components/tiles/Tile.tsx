import React from 'react';
import './Tile.css';
import Tooltip from '@mui/material/Tooltip';
import {selectCount} from "../../features/counter/counterSlice";
import {ClosestColor, selectClosestColor, selectElements} from "../../features/element/elementSlice";
import {useAppSelector} from '../../app/hooks';
import {IElement} from "../color-alchemy/ColorAlchemy";
import {selectMaxMoves} from "../../features/settings/settingsSlice";
import {getTooltip} from "../../utils";

interface Props {
    tile: IElement;
}

export const Tile: React.FC<Props> = ({tile}: Props) => {
    const maxMoves = useAppSelector(selectMaxMoves);
    const count = useAppSelector(selectCount);
    const elements = useAppSelector(selectElements);
    const closestColor = useAppSelector(selectClosestColor);

    const toolTip = getTooltip(tile.color);

    const setCursor = (maxMoves: number, count: number) => {
        return count < maxMoves - 2 ? 'pointer_cursor' : 'default_cursor';
    }

    const setRedBorder = (e: IElement, closestColor: ClosestColor, maxMoves: number, count: number) => {
        if (count < maxMoves) {
            if (e.position === closestColor.position) {
                return 'red_border';
            }
        }
        return '';
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text', event.currentTarget.id);
    }

    return <Tooltip title={toolTip}>
                <div id={String(tile.position)}
                     className={ `element tile ${setCursor(maxMoves, count)} ${setRedBorder(tile, closestColor, maxMoves, count)}` }
                     style={{ backgroundColor: tile.color ? tile.color : elements[tile.position - 1]?.color }}
                     onDragStart={handleDragStart}
                     draggable={count <= maxMoves - 3}>
                </div>
        </Tooltip>
};
