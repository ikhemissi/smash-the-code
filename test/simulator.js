import Simulator from '../src/simulator';

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
  console.log('----------------------------');
  console.log('Running simulator tests ...');
  let simulator = new Simulator();
  simulator.load(exampleHalfFilledGrid);
  simulator.bestMove(inputs, (action) => {
    console.log('Next action will be', action);
    console.log('Decision done in ', (Date.now() - start), 'ms');
    console.log('----------------------------');
  });

}
