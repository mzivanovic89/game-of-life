import { CELL_COLOR } from '../config';
import { Cell } from '../types';

// generate random boolean value
// chance - argument between 0 and 1, closer to 0 means more chance to get true value.
export const randomBoolean = (chance: number = 0.5): boolean => {
  if (chance < 0 || chance > 1) return Math.random() > 0.5;
  return Math.random() > chance;
};

export const create2DArray = (height: number, width: number, fill: any = null): number[][] => {
  return new Array(height).fill(new Array(width).fill(fill));
};

export const createInitialGeneration = (height: number, width: number): Cell[][] => {
  // populate empty grid with random values
  return create2DArray(height, width).map((row) => row.map(() => ({ alive: randomBoolean(0.7), previousGenerationAlive: false })));
};

export const countAliveNeighbours = (grid: Cell[][], rowIndex: number, colIndex: number): number => {
  const rowCount = grid.length - 1;
  const colCount = grid[0].length - 1;

  let aliveNeighboursCount = 0;

  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      // ignore middle cell - we are checking neighbours for that cell
      if (row === 0 && col === 0) {
        continue;
      }

      const r = rowIndex + row;
      const c = colIndex + col;

      // check if we are inside the grid
      if (r >= 0 && r <= rowCount && c >= 0 && c <= colCount) {
        aliveNeighboursCount += grid[r][c].alive ? 1 : 0;
      }
    }
  }

  return aliveNeighboursCount;
};

export const createNextGeneration = (currentGeneration: Cell[][]): Cell[][] => {
  const nextGeneration: Cell[][] = currentGeneration.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const aliveNeighbours = countAliveNeighbours(currentGeneration, rowIndex, colIndex);

      // Game Of Life Rule 1: Any live cell with two or three live neighbours survives.
      if (cell.alive && (aliveNeighbours === 2 || aliveNeighbours === 3)) {
        return { alive: true, previousGenerationAlive: cell.alive };
      }
      // Game Of Life Rule 2: Any dead cell with three live neighbours becomes a live cell.
      if (!cell.alive && aliveNeighbours === 3) {
        return { alive: true, previousGenerationAlive: cell.alive };
      }
      // Game Of Life Rule 3: All other live cells die in the next generation. Similarly, all other dead cells stay dead.
      return { alive: false, previousGenerationAlive: cell.alive };
    })
  );

  return nextGeneration;
};

export const getCellColor = (cell: Cell): string => {
  const { alive, previousGenerationAlive } = cell;

  // alive
  if (alive) {
    return CELL_COLOR.ALIVE;
  }

  // dead but was alive - ghost
  if (!alive && previousGenerationAlive) {
    return CELL_COLOR.PREV_GEN_ALIVE;
  }

  // dead
  return CELL_COLOR.DEAD;
};
