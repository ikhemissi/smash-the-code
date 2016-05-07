import { GRID_ROWS, GRID_COLUMNS, EMPTY, MIN_GROUP_SIZE, SKULL } from './config';
import Cache from './cache';

class Grid {

  constructor(grid, sizes, groupCache) {
    this._data = grid;
    this._sizes = sizes;
    this._cache = groupCache || new Cache();
  }

  get(row, column) {
    return this._data[column][row];
  }

  _set(row, column, color) {

    const previousColor = this._data[column][row];
    this._data[column][row] = color;

    if (previousColor !== EMPTY && previousColor !== color) {
      this._invalidateCache(row, column);
    }
  }

  _invalidateCache(row, column) {
    // TODO check: invalidate the cache of the members of the group ? all of them ? (which are by definition less than 4)
    const connectedBlocks = this._cache.get(row, column);
    if (connectedBlocks) {
      for (let i = 0, l = connectedBlocks.length; i < l; i++) {
        const block = connectedBlocks[i];
        if (Math.abs(block[0] - row) === 1 && Math.abs(block[1] - column) === 1) {
          this._cache.del(block[0], block[1]);
        }
      }
    }

    this._cache.del(row, column);
  }

  _getEmptySlot(column) {
    const row = this._sizes[column];
    return row < GRID_ROWS ? row : undefined;
  }

  add(color, column) {
    const row = this._getEmptySlot(column);
    if (row !== undefined) {
      this._set(row, column, color);
      this._sizes[column]++;
      return [row, column];
    }

    return undefined;
  }

  getSize(column) {
    return this._sizes[column];
  }

  cleanup(cells = []) {
    // console.log('Cleaning up the cells ' + JSON.stringify(cells));
    const moved = new Set();
    for (let i = 0, l = cells.length; i < l; i++) {
      const cell = cells[i];
      const column = cell[1];
      const row = cell[0];
      const nbRows = this._sizes[column];
      for (let currentRow = row; currentRow < nbRows - 1; currentRow++) {
        this._set(currentRow, column, this.get(currentRow + 1, column));
        moved.add([currentRow, column]);
      }

      this._set(nbRows - 1, column, EMPTY);
      this._sizes[column]--;
    }

    // return Array.from(moved);
    const movedCells = [];
    moved.forEach(v => movedCells.push(v));
    return movedCells;
  }

  _connected(row, column) {
    // console.log('>> checking connections to', [row, column], ' (', this.get(row, column), ') ...');
    let group = [[row, column]];
    const color = this.get(row, column);

    // I have 4 neighbouring cells to check
    const neighbours = [];

    if (row > 0) {
      neighbours.push([row - 1, column]);
    }

    if (row < GRID_ROWS - 1) {
      neighbours.push([row + 1, column]);
    }

    if (column > 0) {
      neighbours.push([row, column - 1]);
    }

    if (column < GRID_COLUMNS - 1) {
      neighbours.push([row, column + 1]);
    }

    for (let i = 0, l = neighbours.length; i < l; i++) {
      const neighbour = neighbours[i];
      if (this.get(neighbour[0], neighbour[1]) === color) { // We have the same color
        const neighbourGroup = this._cache.get(neighbour[0], neighbour[1]);
        if (neighbourGroup && neighbourGroup.length) {
          group = group.concat(neighbourGroup || [neighbour]);
        }
      }
    }

    this._cache.set(row, column, group);
    // console.log('>> connections :', group);
    return group; //Array.from(new Set(group));
  }

  // TODO : optimize perf by not checking the same cell twice
  groups(seeds = []) {
    // console.log('looking for groups with seeds :', seeds);
    const list = [];
    // printErr('groups(' + JSON.stringify(seeds) + ')');
    for (let i = 0, l = seeds.length; i < l; i++) {

      const seed = seeds[i];
      const color = this.get(seed[0], seed[1]);

      // printErr('groups> grid[' + seed[0] + '][' + seed[1] + '] == ' + color);
      if (color !== SKULL && color !== EMPTY) {
        var connected = this._connected(seed[0], seed[1]);
        if (connected.length >= MIN_GROUP_SIZE) {
          list.push(connected);
        }
      }

    }

    return list.length ? list : undefined;
  }

  _extendObject(target, source) {
    const keys = Object.keys(source);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      target[key] = source[key];
    }

    return target;
  }

  clone() {

    const data = [
      this._data[0].slice(),
      this._data[1].slice(),
      this._data[2].slice(),
      this._data[3].slice(),
      this._data[4].slice(),
      this._data[5].slice(),
    ];
    const sizes = this._sizes.slice();
    const groupCache = this._cache.clone();
    return new Grid(data, sizes, groupCache);
  }

  loadFrom(map) {

    // Format the map data : go from array of rows of strings to an array of columns of number
    const data = [[], [], [], [], [], []];
    for (let row = 11; row > -1; row--) {
      for (let column = 0; column < 6; column++) {
        data[column].push(map[row][column]);
      }
    }

    if (!this._data) { // first load, just use the formatted data
      this._data = data;

    } else { // Not the first round, so we update old grid value and reindex the cache
      for (let row = 0; row < 12; row++) {
        for (let column = 0; column < 6; column++) {
          this._set(row, column, data[column][row]);
        }
      }
    }

    this._sizes = [0, 0, 0, 0, 0, 0];
    for (let column = 0; column < 6; column++) {
      this._sizes[column] = this._data[column].indexOf(0);
    }

  }

  toString() {
    const rotated = [];
    for (let i = 0; i < 12; i++) {
      rotated.push(new Array(6));
    }

    for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
      for (let rowIndex = 11; rowIndex > -1; rowIndex--) {
        rotated[rowIndex][columnIndex] = this._data[columnIndex][rowIndex];
      }
    }

    return '_____________\n' +
            rotated.map(row => '|' + row + '|').join('\n') +
            '\n_____________';
  }

}

export default Grid;
