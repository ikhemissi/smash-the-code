import Benchmark from 'benchmark';

// TODO : test cloning with array.slice(0) and test an implemetation where we have an array of columns (fixed or variable size, if variable, it may be interesting to save the lengths in a second array)


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


class GridWithJSONStringify {

  constructor(data) {
    this._data = data;
  }

  loadFrom(map) {
    this._data = map;
  }

  get(row, column) {
    return this._data[row][column];
  }

  add(row, column) {

  }

  clone() {
    return new GridWithJSONStringify(JSON.stringify(this._data));
  }
}


class GridWithPropertyCopyingAndConcat {

  constructor(data) {
    this._data = data;
  }

  loadFrom(map) {
    this._data = map;
  }

  get(row, column) {
    return this._data[row][column];
  }

  add(row, column) {

  }

  clone() {
    let copy = new Array(12);
    for (let i = 0, l = 6; i < l; i++) {
      copy[i] = [].concat(this._data[i]);
    }
    return new GridWithPropertyCopyingAndConcat(copy);
  }
}

class GridWithPropertyCopyingAndSlice {

  constructor(data) {
    this._data = data;
  }

  loadFrom(map) {
    this._data = map;
  }

  get(row, column) {
    return this._data[row][column];
  }

  add(row, column) {

  }

  clone() {
    let copy = new Array(12);
    for (let i = 0, l = 12; i < l; i++) {
      copy[i] = this._data[i].slice(0);
    }
    return new GridWithPropertyCopyingAndSlice(copy);
  }
}

class GridWithArrayOfColumns {

  constructor(data) {
    this._data = data;
  }

  loadFrom(map) {
    const data = [[], [], [], [], [], []];
    for (let rowIndex = 11; rowIndex > -1; rowIndex--) {
      for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
        data[columnIndex].push(map[rowIndex][columnIndex]);
      }
    }

    this._data = data;
  }

  get(row, column) {
    return this._data[column][row];
  }

  add(row, column) {

  }

  clone() {
    let copy = new Array(6);
    for (let i = 0, l = 6; i < l; i++) {
      copy[i] = this._data[i].slice(0);
    }

    return new GridWithArrayOfColumns(copy);
  }
}

class GridWithArrayOfColumnsMarcoEdition {

  constructor(data) {
    this._data = data;
  }

  loadFrom(map) {
    const data = [[], [], [], [], [], []];
    for (let rowIndex = 11; rowIndex > -1; rowIndex--) {
      for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
        data[columnIndex].push(map[rowIndex][columnIndex]);
      }
    }

    this._data = data;
  }

  get(row, column) {
    return this._data[column][row];
  }

  add(row, column) {

  }

  clone() {
    const copy = [
      this._data[0].slice(),
      this._data[1].slice(),
      this._data[2].slice(),
      this._data[3].slice(),
      this._data[4].slice(),
      this._data[5].slice(),
    ];

    return new GridWithArrayOfColumnsMarcoEdition(copy);
  }
}

class GridWithArrayBufferAndColumns {

  constructor(buffer) {
    this._buffer = buffer || new ArrayBuffer(6 * 12);
    this._data = new Uint8ClampedArray(this._buffer);
  }

  loadFrom(map) {
    for (let rowIndex = 11; rowIndex > -1; rowIndex--) {
      for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
        this._data[6 * rowIndex + columnIndex] = map[rowIndex][columnIndex];
      }
    }
  }

  get(row, column) {
    return this._data[6 * row + column];
  }

  add(row, column) {

  }

  clone() {
    return new GridWithArrayBufferAndColumns(this._buffer.slice(0));
  }
}

class GridWithArrayOfColumnsNoEmptyCells {

  constructor(data) {
    // TODO : add an array to store sizes (will be used by get)
    this._data = data;
  }

  loadFrom(map) {
    const data = [[], [], [], [], [], []];
    for (let rowIndex = 11; rowIndex > -1; rowIndex--) {
      for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
        const value = map[rowIndex][columnIndex];
        if (value) {
          data[columnIndex].push(value);
        }
      }
    }

    this._data = data;
  }

  get(row, column) {
    return this._data[column][row];
  }

  add(row, column) {

  }

  clone() {
    const copy = [
      this._data[0].slice(),
      this._data[1].slice(),
      this._data[2].slice(),
      this._data[3].slice(),
      this._data[4].slice(),
      this._data[5].slice(),
    ];

    return new GridWithArrayOfColumnsNoEmptyCells(copy);
  }
}

// class GridWithMulipleArrayBuffers {
//
//   constructor(buffer) {
//     this._buffer = buffer || new ArrayBuffer(6 * 12);
//     this._data = new Uint8ClampedArray(this._buffer);
//   }
//
//   loadFrom(map) {
//     for (let rowIndex = 11; rowIndex > -1; rowIndex--) {
//       const row = map[rowIndex];
//       for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
//         this._data[6 * rowIndex + columnIndex] = map[rowIndex][columnIndex];
//       }
//     }
//   }
//
//   get(row, column) {
//     return this._data[6 * row + column];
//   }
//
//   add(row, column) {
//
//   }
//
//   clone() {
//     return new GridWithArrayBufferAndColumns(this._buffer.slice(0));
//   }
// }

// inits
const grids = [
  new GridWithJSONStringify(),
  new GridWithPropertyCopyingAndConcat(),
  new GridWithPropertyCopyingAndSlice(),
  new GridWithArrayOfColumns(),
  new GridWithArrayBufferAndColumns(),
  new GridWithArrayOfColumnsMarcoEdition(),
  new GridWithArrayOfColumnsNoEmptyCells(),
];
grids.forEach(grid => grid.loadFrom(exampleHalfFilledGrid));

export function benchmark() {

  const suite = new Benchmark.Suite('grid');

  // add tests
  suite.add('clone#GridWithJSONStringify', function () {
    grids[0].clone();
  })
  .add('clone#GridWithPropertyCopying', function () {
    grids[1].clone();
  })
  .add('clone#GridWithPropertyCopyingAndSlice', function () {
    grids[2].clone();
  })
  .add('clone#GridWithArrayOfColumns', function () {
    grids[3].clone();
  })
  .add('clone#GridWithArrayBufferAndColumns', function () {
    grids[4].clone();
  })
  .add('clone#GridWithArrayOfColumnsMarcoEdition', function () {
    grids[5].clone();
  })
  .add('clone#GridWithArrayOfColumnsNoEmptyCells', function () {
    grids[6].clone();
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
}
