import Simulator from '../src/simulator';
import { SHORT_SEQUENCE } from './_fixtures/inputs';
import { HALF_FILLED_GRID } from './_fixtures/grids';

// _generateTestSuite(blockA, blockB) {
//   let suite = [];
//   for (let column = 0; column < 6; column++) {
//     for (let rotation = 0; rotation < 3; rotation++) {
//       if ((rotation !== 0 && column === 5) || (rotation !== 2 && column === 0)) {
//         suite.push([column, rotation]);
//       }
//     }
//   }
//
//   return suite;
// }

export function run() {
  const start = Date.now();
  console.log('----------------------------');
  console.log('Running simulator tests ...');
  let simulator = new Simulator();
  simulator.load(HALF_FILLED_GRID);
  simulator.bestMove(SHORT_SEQUENCE, (action) => {
    console.log('Next action will be', action);
    console.log('Decision done in ', (Date.now() - start), 'ms');
    console.log('----------------------------');
  });

}
