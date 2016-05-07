import Grid from '../src/grid';

const inputs = [
  [5, 2],
  [2, 2],
  [2, 4],
  [1, 3],
  [3, 1],
  [4, 4],
  [2, 3],
  [5, 5],
  [1, 1],
];

const exampleEmptyGrid = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

const exampleHalfFilledGrid = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 4, 0, 0, 0],
  [0, 0, 2, 0, 4, 0],
  [0, 0, 6, 3, 3, 0],
  [6, 2, 4, 4, 2, 2],
  [3, 2, 3, 3, 4, 3],
  [4, 4, 2, 1, 5, 4],
  [5, 5, 1, 2, 1, 1],
];

const exampleAlmostFilledGrid = [
  [0, 0, 2, 1, 0, 0],
  [0, 0, 1, 2, 1, 0],
  [3, 2, 3, 3, 4, 3],
  [4, 4, 2, 1, 5, 4],
  [5, 5, 1, 2, 1, 1],
  [2, 1, 4, 4, 3, 3],
  [4, 3, 2, 1, 4, 1],
  [3, 4, 6, 3, 3, 2],
  [6, 2, 4, 4, 2, 2],
  [3, 2, 3, 3, 4, 3],
  [4, 4, 2, 1, 5, 4],
  [5, 5, 1, 2, 1, 1],
];

export function run() {
  const start = Date.now();
  let grid = new Grid();
  grid.loadFrom(exampleHalfFilledGrid);
  let blockA = undefined;
  let blockB = undefined;
  console.log('Grid:');
  console.log(grid);
  console.log('------------------------------------');

  console.log('Adding 5 to 0 and 2 to 1');
  blockA = grid.add(5, 0);
  blockB = grid.add(2, 1);
  console.log(grid);
  console.log('groups:', grid.groups([blockA, blockB]));
  console.log('------------------------------------');

  console.log('Adding 2 to 0 and 2 to 1');
  blockA = grid.add(2, 0);
  blockB = grid.add(2, 1);
  console.log(grid);
  console.log('groups:', grid.groups([blockA, blockB]));

}
