import { getRandomIndex } from './utils';

export const GENES = [
  [0, 0], [0, 1], [0, 3],
  [1, 0], [1, 1], [1, 2], [1, 3],
  [2, 0], [2, 1], [2, 2], [2, 3],
  [3, 0], [3, 1], [3, 2], [3, 3],
  [4, 0], [4, 1], [4, 2], [4, 3],
  [5, 1], [5, 2], [5, 3],
];

export const NB_GENES = GENES.length;

export function randomGene() {
  return getRandomIndex(NB_GENES);
}

export function renderGene(index) {
  return GENES[index];
}
