import Grid from './grid';
import { SIMULATION_DEPTH } from './config';
import { debug } from './utils';

class Simulator {

  constructor(grid, debugMode) { // 6x12 grid
    this.debugMode = debugMode;
    this.grid = grid ? grid.clone() : undefined;

    //this._debug('New Simulator with map :');
    //this._debug(this.grid);
  }

  _debug(message) {
    if (this.debugMode) {
      debug('Simulator> ', message);
    }
  }

  _chainPower(chains) {
    return chains === 1 ? 0 : Math.pow(2, chains + 1);
  }

  _colorBonus(nbColors) {
    return nbColors === 1 ? 0 : Math.pow(2, nbColors - 1);
  }

  _groupBonus(nbBlocks) {
    return nbBlocks < 11 ? nbBlocks - 4 : 8;
  }

  _scoreMultiplier(nbBlocks, chains, nbColors) {
    const multiplier =
      this._chainPower(chains) +
      this._colorBonus(nbColors) +
      this._groupBonus(nbBlocks);

    if (multiplier > 999) {
      return 999;
    } else if (multiplier < 1) {
      return 1;
    }

    return multiplier;
  }

  _score(nbBlocks, chains, nbColors) {
    return 10 * nbBlocks * this._scoreMultiplier(nbBlocks, chains, nbColors);
  }

  fork() {
    return new Simulator(this.grid, this.debugMode);
  }

  _rotate(blockA, blockB, column, rotation = 0) {
    switch (rotation) {
      case 1:
        return [blockA, column, blockB, column];
      case 2:
        return [blockB, column - 1, blockA, column];
      case 3:
        return [blockB, column, blockA, column];
    }
    return [blockA, column, blockB, column + 1];
  }

  _indexOfMax(array) {
    return array.indexOf(Math.max.apply(null, array));
  }

  _indexOfMin(array) {
    return array.indexOf(Math.min.apply(null, array));
  }

  _generateTestSuite(blockA, blockB) {
    let suite = [];
    for (let column = 0; column < 6; column++) {
      for (let rotation = 0; rotation < 3; rotation++) {
        if ((rotation !== 0 && column === 5) || (rotation !== 2 && column === 0)) {
          suite.push([column, rotation]);
        }
      }
    }

    return suite;
  }

  // TODO : take Nuisance points into account
  // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
  _add(blockA, blockB, column, rotation) {

    const moves = this._rotate(blockA, blockB, column, rotation);
    if (moves) {

      let score = 0;

      const colorA = moves[0];
      const columnA = moves[1];
      const colorB = moves[2];
      const columnB = moves[3];

      // console.log('>>>>>> adding', colorA, 'to', columnA, 'and', colorB, 'to', columnB);
      const cellA = this.grid.add(colorA, columnA);
      const cellB = this.grid.add(colorB, columnB);

      if (cellA && cellB) {
        let chains = 0;
        let groups = this.grid.groups([cellA, cellB]);
        while (groups) {

          chains++;
          let blocks = [];
          let colors = {};
          for (let groupIndex = 0, nbGroups = groups.length; groupIndex < nbGroups; groupIndex++) {
            let group = groups[groupIndex];
            for (let i = 0, l = group.length; i < l; i++) {
              blocks.push(group[i]);
            }

            colors[this.grid.get(group[0][0], group[0][1])] = true;
          }

          // console.log('Group: ', blocks);
          score += this._score(blocks.length, chains, Object.keys(colors).length);
          groups = this.grid.groups(this.grid.cleanup(blocks));
        }
      }

      return score;
    }

    return undefined; // If for whatever reason, the game can't continue
  }

  _getRandomIndex(arraySize) {
    return Math.floor(Math.random() * arraySize);
  }

  _selectMove(moves) {
    // Select random index
    // TODO : take into account the sizes of of each column (prefer empty columns)
    if (moves && moves.length) {
      return undefined;
      const movesByColumn = [[], [], [], [], [], []];
      const columnBlocks = [7, 7, 7, 7, 7, 7]; // default value is 7 (more than column maximum blocks)
      for (let i = 0, l = moves.length; i < l; i++) {
        let move = moves[i];
        let column = move[0];
        movesByColumn[column].push(move);
        columnBlocks[column] = this.grid.getSize(column);
      }

      const lestFilledIndex = this._indexOfMin(columnBlocks);
      const chosenColumnMoves = movesByColumn[lestFilledIndex];
      const randomIndex = this._getRandomIndex(chosenColumnMoves.length);
      return chosenColumnMoves[randomIndex];
    }

    return this._emergencyMove();
  }

  _emergencyMove() {
    const emergencyColumn = this._getRandomIndex(5);
    const emergencyRotation = this._getRandomIndex(2);
    return [0, emergencyColumn, emergencyRotation];
  }

  _simulate(inputs, previousMoves = []) {

    if (inputs && inputs.length) {
      // console.log('>>>>>>>>>>>>>>>>>>>', SIMULATION_DEPTH - inputs.length + 1, '>>>>>>>>>>>>>>>>>>>');
      // console.log('Simulating the following moves', inputs, 'on', this.grid);

      const start = Date.now();
      const colors = inputs[0];
      const colorA = colors[0];
      const colorB = colors[1];
      const remaining = inputs.slice(1);

      let max = -1;
      let bestTests = [];

      const tests = this._generateTestSuite(colorA, colorB);
      // console.log('Simulation (', inputs.length, 'inputs) on top of ', previousMoves, '...');
      if (previousMoves[0] === '5:2:0:0') {
        // console.log('>> current grid:');
        // console.log(this.grid);
      }
      // console.log('----------------------', SIMULATION_DEPTH - inputs.length + 1, '----------------------');
      // console.log('----------- tests:', tests);
      // console.log('----------------------', SIMULATION_DEPTH - inputs.length + 1, '----------------------');

      for (let i = 0, l = tests.length; i < l; i++) {
        let test = tests[i];
        let fork = this.fork();
        let stepScore = fork._add(colorA, colorB, test[0], test[1]);
        // console.log('>> simulating with blocks', [colorA, colorB], 'and position', test, 'and got score', stepScore);
        // console.log('=> simulation with', test, 'gave', this.grid);
        // console.log('<<<<<<<<<<<<<<<<<<<<<<', SIMULATION_DEPTH - inputs.length + 1, '<<<<<<<<<<<<<<<<<<<<<<');

        let simulation = fork._simulate(remaining, previousMoves.concat([[colorA, colorB, test[0], test[1]].join(':')]));
        if (previousMoves[0] === '5:2:0:0') {
          // console.log('>>>> after simulating:');
          // console.log(fork.grid);
        }
        if (stepScore !== undefined) {
          let score = stepScore + (simulation ? simulation[0] : 0);
          if (score > max) {
            max = score;
            bestTests = [test];

          } else if (score == max) {
            max = score;
            bestTests.push(test);
          }
        }
      }

      if (bestTests.length) {
        const nextMove = this._selectMove(bestTests);
        // console.log('Simulation (', inputs.length, 'inputs) entries ended in', Date.now() - start, 'with yield estimation of', max, 'if playing', [colorA, colorB], 'with position', nextMove);
        return nextMove ? [max, nextMove[0], nextMove[1]] : this._emergencyMove();
      }
    }

    return undefined;
  }

  load(map) {
    this.grid = this.grid || new Grid();
    this.grid.loadFrom(map);
  }

  _getRandomSetting() {
    printErr('random!');
    return [0, 0];
  }

  bestMove(inputs, callback) { // inputs is an array of 8 pairs of colors

    // console.log('Simulating the following moves', inputs, 'on', this.grid);

    // console.log('Starting search for best move given the blocks', inputs[0]);
    //this._debug('current move : ' + inputs[0]);
    const start = Date.now();
    this._ended = undefined;

    // Timeout(90).then(() => {
    //   if (!this._ended) {
    //     this._ended = true;
    //     // console.log('Best move seach ended in ', Date.now() - start, 'ms with timeout');
    //     callback(this._emergencyMove());
    //   }
    // });

    const simulation = this._simulate(inputs.slice(0, SIMULATION_DEPTH));
    const setting = simulation ? simulation : this._emergencyMove();
    //this._debug('Expecting a yield of ' + simulation[0] + ' by playing ' + JSON.stringify(simulation[1]));
    // console.log('Simulation ended in ', Date.now() - start, 'ms with result', simulation);
    if (!this._ended) {
      this._ended = true;
      callback(setting);
    }
  }
}

export default Simulator;
