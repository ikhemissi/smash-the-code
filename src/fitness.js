function _distributionScore() { // score for block distribution over columns (try to get evenly distributed blocks over columns)
  // if (moves && moves.length) {
  //
  //   if (moves.length === 1) {
  //     return moves[0];
  //
  //   } else {
  //     const movesByColumn = [[], [], [], [], [], []];
  //     const columnBlocks = [7, 7, 7, 7, 7, 7]; // default value is 7 (more than column maximum blocks)
  //     for (let i = 0, l = moves.length; i < l; i++) {
  //       let move = moves[i];
  //       let column = move[0];
  //       movesByColumn[column].push(move);
  //       columnBlocks[column] = this.grid.getSize(column);
  //     }
  //
  //     const lestFilledIndex = this._indexOfMin(columnBlocks);
  //     const chosenColumnMoves = movesByColumn[lestFilledIndex];
  //     const randomIndex = this._getRandomIndex(chosenColumnMoves.length);
  //     return chosenColumnMoves[randomIndex];
  //   }
  // }
}

function _score() {
  
}

// TODO : take into account nuisance points
// TODO : take into account opponent performance
export function fitness(moves, score, sizes) {
  // TODO : calculate the fitness of a sequence of moves
}
