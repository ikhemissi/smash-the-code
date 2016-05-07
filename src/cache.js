class Cache {

  constructor(data) {
    this._data = new Map(data);
  }

  _id(row, column) {
    return row + '' + column;
  }

  get(row, column) {
    return this._data.get(this._id(row, column));
  }

  set(row, column, value) {
    this._data.set(this._id(row, column), value);
  }

  del(row, column) {
    this._data.delete(this._id(row, column));
  }

  has(row, column) {
    return this._data.has(this._id(row, column));
  }

  clear() {
    this._data.clear();
  }

  clone() {
    return new Cache(this._data);
  }

}

export default Cache;
