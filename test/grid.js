import Grid from '../src/grid';
import { SIMPLE_SEQUENCE } from './_fixtures/inputs';
import { EMPTY_GRID } from './_fixtures/grids';

export function run() {
  const start = Date.now();
  let grid = new Grid();
  grid.loadFrom(EMPTY_GRID);
  onsole.log('Grid:');
  console.log(grid);
  console.log('------------------------------------');

  SIMPLE_SEQUENCE.forEach((blocks) => {
    let colorA = blocks[0];
    let colorB = blocks[1];
    console.log('Adding 5 to 0 and 2 to 1');
    blockA = grid.add(5, 0);
    blockB = grid.add(2, 1);
    console.log(grid);
    console.log('groups:', grid.groups([blockA, blockB]));
    console.log('------------------------------------');
  });

}
