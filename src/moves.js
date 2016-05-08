/* Managing population (possible moves) and inviduals (a move) in genetic algorithm */

import { NB_GENES, randomGene } from './genes';
import { getRandomIndex } from './utils';
import {
  SIMULATION_DEPTH,
  POPULATION_SIZE,
  POPULATION_ELISTISM,
  POPULATION_CROSSOVER_UNIFORM_RATE,
  POPULATION_CROSSOVER_SET_SIZE,
  POPULATION_MUTATION_RATE
} from './config';

export default class Moves {

  constructor(simulator, inputs) {
    this._data = undefined;
    this._generation = 0;
    this._fittest = undefined;
    this._simulator = simulator;
    this._inputs = inputs;
    this._forks = new Map();
  }

  _randomMove(size = SIMULATION_DEPTH) {
    const move = [];
    for (let i = 0; i < size; i++) {
      move[i] = randomGene();
    }

    return move;
  }

  generation() {
    return this._generation;
  }

  fittest() {
    return this._fittest;
  }

  _findFittest(moves) {
    // TODO blocker: look for the real fittest in the list of moves
    let results = [];
    for (let i = 0, l = moves.length; i < l; i++) {
      let move = moves[i];
      let fork = this._forks.get(move);
      if (!fork) { // no cache for this move
        fork = this._simulator.execute(this._inputs, move);
        this._forks.set(move, fork);
      }
      results[i] = fork.score();
    }

    const maxFitness = Math.max.apply(null, results);
    const fittestId = results.indexOf(maxFitness);
    // printErr('results:', results);
    return [maxFitness, moves[fittestId]]; // return the fittest and its fitness
  }

  _crossover(move1, move2) {
    const move = [];
    for (let i = 0; i < SIMULATION_DEPTH; i++) {
      move[i] = (Math.random() > POPULATION_CROSSOVER_UNIFORM_RATE) ? move1[i] : move2[i];
    }

    return move;
  }

  _mutate(move) {
    for (let i = 0, l = SIMULATION_DEPTH; i < l; i++) {
      if (Math.random() <  POPULATION_MUTATION_RATE) {
        move[i] = randomGene();
      }
    }

    return move;
  }

  _sample(size = POPULATION_CROSSOVER_SET_SIZE) {
    let sample = [];
    for (let i = 0; i < size; i++) {
      sample[i] = this._data[getRandomIndex(POPULATION_SIZE)];
    }

    return sample;
  }

  _selectMoveFromSample() {
    return this._findFittest(this._sample());
  }

  evolve() {

    this._generation++;

    if (!this._data) {
      this._data = [];
      for (let i = 0; i < POPULATION_SIZE; i++) {
        this._data[i] = this._randomMove();
      }

    } else {

      let newMoves = [];
      let searchIndex = 0;
      if (POPULATION_ELISTISM) {
        newMoves = [this._fittest[1]];
        searchIndex = 1; // we already have one
      }

      for (let i = searchIndex; i < POPULATION_SIZE; i++) {
        let newMove = this._crossover(this._selectMoveFromSample()[1], this._selectMoveFromSample()[1]);
        newMoves[i] = this._mutate(newMove);
      }

      this._data = newMoves;
    }

    this._fittest = this._findFittest(this._data);
  }

}
