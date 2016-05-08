import { randomGene, renderGene } from './genes';
import Moves from './moves';
import Simulator from './simulator';

export default class Ai {

  constructor() {
    this._simulator = new Simulator();
  }

  // TODO check : should I add caches to increase performance ?
  load(map) {
    this._simulator.load(map);
  }

  // TODO : take into account the duration for looking for a candidate in the while loop
  bestMove(inputs, threashold) {
    let move = [0, randomGene()]; // fitness 0 (unknown) and a random gene
    let population = new Moves(this._simulator, inputs);
    while (Date.now() < threashold) {
      population.evolve();
      let candidate = population.fittest();
      // printErr('candidate:', candidate);
      if (candidate && candidate[0] > move[0]) { // take the move with better fitness
        move = candidate;
      }
    }

    // return actual move to play and the number of generations (iterations) it took to decide on this move
    return [renderGene(move[1]), move[0], population.generation()];
  }

}
