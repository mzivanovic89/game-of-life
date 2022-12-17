import { useEffect, useState } from 'react';
import { CELL_SIZE, CONTROLS_DIV_HEIGHT, LIFE_DURATION } from './config';
import { Cell } from './types';
import { createInitialGeneration, createNextGeneration, getCellColor } from './utils/game';
import useWindowDimensions from './hooks/useWindowDimensions';
import useInterval from './hooks/useInterval';

const App: React.FC = () => {
  const { height, width } = useWindowDimensions();

  const gridHeight = Math.floor((height - CONTROLS_DIV_HEIGHT) / CELL_SIZE);
  const gridWidth = Math.floor(width / CELL_SIZE);
  const controlsHeight = height - gridHeight * CELL_SIZE;

  const [gridState, setGridState] = useState<Cell[][]>(() => createInitialGeneration(gridHeight, gridWidth));
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const toggleCellLife = (rowIndex: number, colIndex: number) => {
    const gridCopy: Cell[][] = JSON.parse(JSON.stringify(gridState));
    gridCopy[rowIndex][colIndex].alive = !gridCopy[rowIndex][colIndex].alive;

    setGridState(gridCopy);
  };

  const handleNextGen = () => setGridState(createNextGeneration(gridState));

  const resetGridState = () => setGridState(createInitialGeneration(gridHeight, gridWidth));

  // refresh gridState when window resizes to fit +1/-1 row/column
  useEffect(resetGridState, [gridHeight, gridWidth]);

  useInterval(() => {
    if (isRunning) {
      handleNextGen();
    }
  }, LIFE_DURATION);

  return (
    <>
      <div className='flex center'>
        <div>
          {gridState.map((row, rowIndex) => (
            <div key={rowIndex} className='flex'>
              {row.map((_, colIndex) => (
                <div
                  onClick={() => toggleCellLife(rowIndex, colIndex)}
                  key={`${rowIndex}${colIndex}`}
                  style={{
                    backgroundColor: getCellColor(gridState[rowIndex][colIndex]),
                    height: CELL_SIZE,
                    width: CELL_SIZE,
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='flex center controls' style={{ height: controlsHeight }}>
        <div>
          <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Stop' : 'Start'}</button>
        </div>
        <div>
          <button onClick={handleNextGen}>Next Generation</button>
        </div>
        <div>
          <button onClick={resetGridState}>Reset</button>
        </div>
      </div>
    </>
  );
};

export default App;
