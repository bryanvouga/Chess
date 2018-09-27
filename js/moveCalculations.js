function getMoves(board, currentPiece) {
  switch (currentPiece.type) {
    case "pawn"   : return getPawnMoves(board, currentPiece)
    case "knight" : return getKnightMoves(board, currentPiece)
    case "rook"   : return getRookMoves(board, currentPiece)
    case "bishop" : return getBishopMoves(board, currentPiece)
    case "king"   : return getKingMoves(board, currentPiece)
    case "queen"  : return getQueenMoves(board, currentPiece)
    default       : return []
  }
}

function getPawnMoves(board, currentPiece) {
  switch (currentPiece.team) {
    case 'playerOne' : return getPlayerOnePawnMoves(board, currentPiece)
    case 'playerTwo' : return getPlayerTwoPawnMoves(board, currentPiece)
  }
}

function getPlayerOnePawnMoves(board, currentPiece) {
  let [i, j] = currentPiece.index
  let moves = []
  if (boundsCheck([i-1, j]) && board[i-1][j].team === " ") {
    moves.push([i-1, j])
    if (i === 6 && board[i-2][j].team === " ") {
      moves.push([i-2, j])
    }
  }
  if (boundsCheck([i-1, j+1]) && board[i-1][j+1].team === "playerTwo") {
    moves.push([i-1, j+1])
  }
  if (boundsCheck([i-1, j-1]) && board[i-1][j-1].team === "playerTwo") {
    moves.push([i-1, j-1])
  }
  return moves
}

function getPlayerTwoPawnMoves(board, currentPiece) {
  let [i, j] = currentPiece.index
  let moves = []
  if (boundsCheck([i+1, j]) && board[i+1][j].team === " ") {
     moves.push([i+1, j])
     if (i === 1 && board[i+2][j].team === " "){
       moves.push([i+2, j])
     }
  }
  if (boundsCheck([i+1, j+1]) && board[i+1][j+1].team === "playerOne"){
     moves.push([i+1, j+1])
  }
  if (boundsCheck([i+1, j-1]) && board[i+1][j-1].team === "playerOne") {
    moves.push([i+1, j-1])
  }
  return moves
}

function getKnightMoves(board, currentPiece) {
  let [i, j] = currentPiece.index
  let moves = [[i+2, j+1],[i+2, j-1],[i-2, j+1],[i-2, j-1],
               [i+1, j+2],[i+1, j-2],[i-1, j+2],[i-1, j-2]]
  return filterInvalidSpots(board, currentPiece, moves)
}

function getRookMoves(board, currentPiece) {
  return concat(
    addSpotUntilOtherTeam(board, currentPiece, 1, 0),
    addSpotUntilOtherTeam(board, currentPiece, -1, 0),
    addSpotUntilOtherTeam(board, currentPiece, 0, 1),
    addSpotUntilOtherTeam(board, currentPiece, 0, -1))
}

function getBishopMoves(board, currentPiece) {
  return concat(
    addSpotUntilOtherTeam(board, currentPiece, 1, 1),
    addSpotUntilOtherTeam(board, currentPiece, 1, -1),
    addSpotUntilOtherTeam(board, currentPiece, -1, 1),
    addSpotUntilOtherTeam(board, currentPiece, -1, -1))
}


function getQueenMoves(board, currentPiece) {
  return concat(getRookMoves(board, currentPiece), getBishopMoves(board, currentPiece))
}

function getKingMoves(board, currentPiece) {
  let [i, j] = currentPiece.index
  let moves = [[i-1,j+1],[i,j+1] ,[i+1, j+1],
               [i-1,j]  ,         [i+1, j]  ,
               [i-1,j-1],[i,j-1], [i+1, j-1]]
  //castling
  if(currentPiece.canCastle) {
    moves = addCastleMove(board, currentPiece, moves)
  }
  return filterInvalidSpots(board, currentPiece, moves)
}

//-----HELPERS-----//
function addCastleMove(board, currentPiece, moves) {
  let [i, j] = currentPiece.index
  if (currentPiece.team === "playerOne"
     && i === 7 && j === 4
     && board[7][5].team === " "
     && board[7][6].team === " "
     && board[7][7].type === "rook"
     && board[7][7].team === "playerOne") {
       moves.push([7, 6])
  } else if (currentPiece.team === "playerOne"
     && i === 7 && j === 4
     && board[7][3].team === " "
     && board[7][2].team === " "
     && board[7][1].team === " "
     && board[7][0].type === "rook"
     && board[7][0].team === "playerOne") {
       moves.push([7, 2])
  } else if (currentPiece.team === "playerTwo"
     && i === 0 && j === 4
     && board[0][5].team === " "
     && board[0][6].team === " "
     && board[0][7].type === "rook"
     && board[0][7].team === "playerOne") {
       moves.push([0, 6])
  } else if (currentPiece.team === "playerTwo"
     && i === 0 && j === 4
     && board[0][3].team === " "
     && board[0][2].team === " "
     && board[0][1].team === " "
     && board[0][0].type === "rook"
     && board[0][0].team === "playerTwo") {
       moves.push([0, 2])
  }
  return moves
}

function addSpotUntilOtherTeam(board, currentPiece, xDelta, yDelta) {
  [i, j] = currentPiece.index
  let x = xDelta
  let y = yDelta
  let moves = []
  while (boundsCheck([i+x, j+y])  && board[i+x][j+y].team !== currentPiece.team) {
    moves.push([i+x, j+y])
    if (board[i+x][j+y].team === otherTeam(currentPiece.team)){
      break;
    } else {
      x = x + xDelta
      y = y + yDelta
    }
  }
  return moves
}

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
