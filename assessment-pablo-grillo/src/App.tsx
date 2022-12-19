import React, {useEffect} from 'react';
import './App.css';
import { ColorAlchemy } from "./components/color-alchemy/ColorAlchemy";
import {GameHeader} from "./components/game-header/GameHeader";
import {useAppDispatch} from "./app/hooks";
import {initialDataSetting, SettingsState} from "./features/settings/settingsSlice";
import {addArray} from "./features/element/elementSlice";
import {startCounter} from "./features/counter/counterSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
      fetch("http://localhost:9876/init")
          .then((res) => res.json())
          .then((data: SettingsState) => {
              dispatch(initialDataSetting(data));
              dispatch(addArray(data));
              dispatch(startCounter(data.maxMoves));
          });
      });

  return <div className="app">
      <div className="title">RGB Alchemy</div>
      <GameHeader/>
      <ColorAlchemy/>
    </div>
};

export default App;
