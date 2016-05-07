import Simulator from './simulator';

class Engine {

  constructor() {
    // this._history = '';
    this._simulator = new Simulator();
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
      let start = Date.now();
      let inputs = this._getInputs();
      let myMap = this._getCharacterMap();
      let ennemyMap = this._getCharacterMap();
      this._simulator.load(myMap);
      // this._history += '[' + inputs[0] + '],';
      this._simulator.bestMove(inputs, (move) => { // move = [cost, position, rotation]
        printErr(inputs[0], '->', move, 'in', Date.now() - start);
        // printErr(this._history);
        print(move[1] + ' ' + move[2]);
      }); // bestPosition(myMap, ennemyMap, inputs)
      // while (Date.now() < (start + 90)) {
      //   // Security measure to prevent the case where we don't return anything !!
      // }
    }
  }
}

export default Engine;
