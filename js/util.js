function otherTeam(team) {
  return {'playerOne':'playerTwo','playerTwo':'playerOne'}[team]
}

function filterInvalidSpots(board, currentPiece, moves) {
  return moves
        .filter((index) => boundsCheck(index))
        .filter(([i, j]) => board[i][j].team !== currentPiece.team)
}

function concat(...xs) {
  return [].concat(...xs)
}

function boundsCheck([i, j]) {
  return i < 8 && j < 8 && i >= 0 && j >= 0
}

function contains(array, [ii, jj]) {
  return array.some(([i, j]) => i === ii && j === jj)
}

function idToIndex(id){
  return id.split(",").map((str) => Number(str))
}

function assoc(key, value, object) {
  return {
    ...object,
    [key]: value,
  }
}

function camelCase(word1, word2){
  return word1.toLowerCase() + word2.toLowerCase().charAt(0).toUpperCase() + word2.substr(1)
}
