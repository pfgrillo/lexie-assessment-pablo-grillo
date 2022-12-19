import React, {useEffect} from 'react';
import {Tile} from "../tiles/Tile";
import './GameHeader.css';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {Element} from "../../enum";
import {
    clearSuccessColor,
    restartGame,
    selectClosestColor
} from "../../features/element/elementSlice";
import {
    selectMaxMoves,
    selectTarget,
    selectUserId,
    sideEffectFetchNewData
} from "../../features/settings/settingsSlice";
import {selectCount, startCounter} from "../../features/counter/counterSlice";

export const GameHeader: React.FC = () => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectUserId);
    const count = useAppSelector(selectCount);
    const maxMoves = useAppSelector(selectMaxMoves);
    const target = useAppSelector(selectTarget);
    const closestColor = useAppSelector(selectClosestColor);
    const targetColor = `rgb(${target.join(', ')})`;

    const confirmAlert = (message: string) => window.confirm(message);

    if (count === 0 && maxMoves) {
        const restart = confirmAlert('Failed. Do you wanna try again?');
        if (restart) {
            dispatch(sideEffectFetchNewData());
            dispatch(restartGame());
            dispatch(startCounter(maxMoves));
            dispatch(clearSuccessColor());
        }
    }

    useEffect(() => {
        if (closestColor.diff < 10 && closestColor.diff !== 0) {
            setTimeout(() => {
                const restart = confirmAlert('Success! Do you wanna play again?');
                if (restart) {
                    dispatch(clearSuccessColor())
                    dispatch(sideEffectFetchNewData());
                    dispatch(restartGame());
                    dispatch(startCounter(maxMoves));
                }
            }, 500)
        }
    })


    return <div className="game_header">
            <div className="labels">User ID: {userId}</div>
            <div className="labels">Moves Left: {count}</div>
            <div className="labels color_info">
                <div style={{marginRight: "18px"}}>Target color: </div>
                    <Tile tile={{element: Element.Tile, color: targetColor, position: 0}}/>
                </div>
            <div className="color_info">
                <div style={{marginRight: "10px"}}>Closest color:</div>
                    <Tile tile={{element: Element.Tile, color: closestColor.color, position: 0}}/>
                <div style={{marginLeft: "10px"}}>&Delta;={closestColor.color ? Number(closestColor.diff).toFixed(2) : 0}%</div>
            </div>
        </div>
};
