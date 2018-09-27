function minimaxRoot(state) {
  const {board} = state
  const player = 'playerTwo'
  let children = getChildren(board, player)
  let boards = []

  for (let i = 0; i < children.length; i++) {
    value = minimax(children[i], 2, 'playerOne', 10000, -10000)
    boards.push({value:value, board:children[i]})
  }

  let minBoard = boards[Math.floor(Math.random() * boards.length)]
  boards.forEach((board) => {
    if(board.value < minBoard.value) {
      minBoard = board
    }
  })

  return {
    ...state,
    board: minBoard.board
  }
}


function minimax(board, depth, player, alpha, beta) {
  if (depth === 0) {
    return rateBoard(board)
  }
  let children = getChildren(board, player)

  if (player === "playerTwo") {
    let value = 10000
    for (let child of children) {
      value = Math.min(value, minimax(child, depth-1, otherTeam(player), alpha, beta))
      alpha = Math.min(alpha, value)
      if (beta >= alpha) {
        return value;
      }
    }
    return value
  }

  if (player === "playerOne") {
    let value = -10000
    for (let child of children) {
      value = Math.max(value, minimax(child, depth-1, otherTeam(player), alpha, beta))
      beta = Math.max(beta, value)
      if (beta >= alpha) {
        return value;
      }
    }
    return value
  }
}

function getChildren(board, player) {
  let children = []
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if(piece.team === player) {
        piece.index = [i, j]
        const moves = getMoves(board, piece)
        moves.forEach(([ii, jj]) => {
            const newBoard = copyTwoDArray(board)
            const temp = newBoard[i][j]
            newBoard[i][j] = {team: " "}
            newBoard[ii][jj] = temp
            children.push(newBoard)
        })
      }
    })
  })
  return children
}

function copyTwoDArray(twoDArray) {
  let copy = []
  twoDArray.forEach((row, i) => {
    copy[i] = []
    row.forEach((piece, j) => {
      copy[i][j] = piece
    })
  })
  return copy
}

function copyOneDArray(array) {
  let copy = []
  array.forEach((element, i) => {
    copy.push(element)
  })
  return copy
}


function rateBoard(board) {
  let score = 0
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (board[i][j].team !== " ") {
        score += ratePiece(piece)
      }
    })
  })
  return score
}

function ratePiece(piece) {
  return {
    "playerOne": {
      "pawn":   10,
      "knight": 30,
      "rook":   50,
      "bishop": 30,
      "king":   1000,
      "queen":  200
    }[piece.type],
    "playerTwo": {
      "pawn":   -10,
      "knight": -30,
      "rook":   -50,
      "bishop": -30,
      "king":   -1000,
      "queen":  -200
    }[piece.type]
  }[piece.team]
}
