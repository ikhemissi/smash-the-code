import Simulator from './simulator';
import Ai from './ai';
import { TIMEOUT } from './config';
import { randomGene, renderGene } from './genes';


class Engine {

  constructor() {
    this._brain = new Ai();
  }

  _cleanupEntry(input) {
    if (input === '0') {
      input = 6; // skull
    } else if (input === '.') {
      input = 0; // empty
    }

    return +input;
  }

  _getInputs() {
    const inputs = new Array(8);
    for (let i = 0; i < 8; i++) {
      const data = readline().split(' ').map(this._cleanupEntry);
      inputs[i] = [data[0], data[1]];
    }

    return inputs;
  }

  // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
  _getCharacterMap() {
    const map = new Array(12);
    for (let i = 0; i < 12; i++) {
      map[i] = readline().split('').map(this._cleanupEntry);
    }

    return map;
  }

  start() {
    // game loop
    while (true) {

      let inputs = this._getInputs();
      let myMap = this._getCharacterMap();
      let ennemyMap = this._getCharacterMap();
      let start = Date.now();

      this._brain.load(myMap);
      let move = this._brain.bestMove(inputs, start + TIMEOUT); // [[column, rotation], fitness, generations]
      // printErr('move:', move);
      if (!move || move[0] === undefined || move[0][0] === undefined || move[0][1] === undefined) {
        move = [renderGene(randomGene()), 0, 0];
      }

      let stats = move[1] + ' (' + move[2] + ') in ' + (Date.now() - start) + 'ms';
      // printErr(inputs[0], '->', move[0], 'with', stats);
      print(move[0][0] + ' ' + move[0][1], stats);
    }
  }
}

export default Engine;
