function minimaxRoot(state) {
  const {board} = state
  const player = 'playerTwo'
  let children = getChildren(board, player)
  let boards = []

  for (let i = 0; i < children.length; i++) {
    value = minimax(children[i], 2, 'playerOne', 100000, -100000)
    boards.push({value:value, board:children[i]})
  }

  let minBoard = boards[Math.floor(Math.random() * boards.length)]
  boards.forEach((board) => {
    if(board.value < minBoard.value) {
      minBoard = board
    }
  })
  const nextPlayerOneInmate = getPlayerOneInmate(board, minBoard.board)
  if (nextPlayerOneInmate) {
    state.playerOneJail.push(nextPlayerOneInmate)
  }
  state.board = minBoard.board
  return state
}

function minimax(board, depth, player, alpha, beta) {
  if (depth === 0) {
    return rateBoard(board)
  }
  let children = getChildren(board, player)

  if (player === "playerTwo") {
    let value = Infinity
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
    let value = -Infinity
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


function getPlayerOneInmate(board1, board2) {
  let newJail = []
  board1 = board1.flat().filter((piece) => piece.team === 'playerOne')
  board2 = board2.flat().filter((piece) => piece.team === 'playerOne')
  if (board1.length !== board2.length) {
    let count = {pawn:0, rook:0, knight:0, bishop:0, king:0, queen:0}
    board1.forEach(piece => count[piece.type]++)
    board2.forEach(piece => count[piece.type]--)
    for (var piece in count) {
      if (count[piece] === 1) {
        return {team:'playerOne', type:piece}
      }
    }
  }
  return 0
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
