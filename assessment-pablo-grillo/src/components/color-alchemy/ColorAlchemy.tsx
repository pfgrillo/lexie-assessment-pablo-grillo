import React from 'react';
import './ColorAlchemy.css';
import {Tile} from "../tiles/Tile";
import {Element} from "../../enum";
import {useAppSelector} from "../../app/hooks";
import {selectElements} from "../../features/element/elementSlice";
import {Source} from "../sources/Sources";

export interface IElement {
    position: number;
    element: Element;
    color: string;
}

export const ColorAlchemy: React.FC = () => {
    const elements = useAppSelector(selectElements);

    const gameGridJsx = elements.map((e) => {
        if (e.element === Element.Tile) {
            return <Tile key={e.position} tile={e}/>
        } else if (e.element === Element.Source) {
            return <Source key={e.position} source={e}/>
        } else {
            return <div key={e.position}/>;
        }
    })

    return <div className="color_alchemy">
        <div className="external_grid">
            {gameGridJsx}
        </div>
    </div>
};
