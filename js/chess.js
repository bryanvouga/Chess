//-----MAIN-----//
let state;
function main(action) {
  state = update(state, action)
  if(action.type === "MOUSEENTER" || action.type === "MOUSELEAVE") {
    toggleHoverHighlight(state, action)
  } else {
    document.getElementById('root').innerHTML = render(state)
  }
}
main({type:'INITIALIZE'})

//-----UPDATE------//
function update(state, action) {
  switch (action.type) {
    case 'INITIALIZE' : return initialState()
    case 'CLICK'      : return click(state, action.value)
    case 'CHANGECOLOR': return changeColor(state)
    case 'BACK'       : return back(state)
    default           : return state
  }
}

// 'INITIALIZE'
function initialState() {
  return {
    board          : initialBoard(),
    playerOneJail  : [],
    playerTwoJail  : [],
    history        : [],
    currentPiece   : {},
    color          : 'white',
    moves          : [],
    mode           : 'SELECT',
    isSinglePlayer : true
  }
}

function initialBoard() {
  const piece = (type, player) => ({team: player, type: type})

  const rowOfPawns = (player) => {
    let row = []
    while (row.length < 8) row.push(piece('pawn', player))
    return row
  }

  const rowOfPieces = (player) => {
		const kingPiece = (player) => ({team: player, type: 'king', canCastle: true})
    const rook = piece('rook', player)
    const knight = piece('knight', player)
    const bishop = piece('bishop', player)
    const queen = piece('queen', player)
    const king = kingPiece(player)
    return (
      [rook, knight, bishop, queen, king, bishop, knight, rook]
    )
  }

  const emptyRow = () => {
    let row = []
    while (row.length < 8) row.push({team:' '})
    return row
  }

  return (
    [rowOfPieces('playerTwo'),
     rowOfPawns('playerTwo'),
     emptyRow(),
     emptyRow(),
     emptyRow(),
     emptyRow(),
     rowOfPawns('playerOne'),
     rowOfPieces('playerOne')]
  )
}

// 'CLICK'
function click(state, event) {
  switch (state.mode) {
    case 'SELECT': return select(state, event)
    case 'MOVE'  : return move(state, event)
    default      : return state
  }
}

function select(state, event) {
  const [i, j] = idToIndex(event.target.id)
  if (state.board[i][j].team === "playerOne") {
    return swapMode(setMoves(assoc('currentPiece', getPieceInformation(state, event), state)))
  } else {
    return state
  }
}

function setMoves(state) {
  const {currentPiece, board} = state
  return {
    ...state,
    moves:  getMoves(board, currentPiece)
  }
}

function getPieceInformation(state, event) {
  const [i, j] = event.target.id.split(",").map((str) => Number(str))
  const piece = state.board[i][j]
  piece.index = [i, j]
  return piece
}

function move(state, event) {
  const [i, j] = idToIndex(event.target.id)
  if (contains(state.moves, [i, j])) {
    return swapMode(saveHistory(minimaxRoot(movePiece(state, [i, j]))))
  } else {
    return swapMode(assoc('moves', [], state))
  }
}

function saveHistory(state) {
  state.history.push(JSON.stringify({
          board:         state.board,
          playerOneJail: state.playerOneJail,
          playerTwoJail: state.playerTwoJail,
        }))
  return state
}

function movePiece(state, [i, j]) {
  const [ii, jj] = state.currentPiece.index
  const moveLocation = state.board[i][j]

  state.board[i][j] = state.board[ii][jj]
  state.board[ii][jj] = {team: " "}

  if (moveLocation.team === "playerOne") {
    state.playerOneJail.push(moveLocation)
  }
  if (moveLocation.team === "playerTwo") {
    state.playerTwoJail.push(moveLocation)
  }

  //castling
  if (state.currentPiece.type === "king" && state.board[i][j].canCastle) {
    state.board[i][j].canCastle = false
    if (state.currentPiece.team === "playerOne") {
      state.board = playerOneCastlingMove(state.board, [i, j])
    }
    if (state.currentPiece.team === "playerTwo") {
      state.board = playerTwoCastlingMove(state.board, [i, j])
    }
  }

  // clear moves
  state.moves = []
  return state
}

function playerOneCastlingMove(board, [i, j]) {
  if (i === 7 && j === 6) {
    board[7][5] = board[7][7]
    board[7][7] = {team:' '}
  }
  if (i === 7 && j === 2) {
    board[7][3] = board[7][0]
    board[7][0] = {team:' '}
  }
  return board
}

function playerTwoCastlingMove(board, [i, j]) {
  if (i === 0 && j === 6) {
    board[0][5] = board[0][7]
    board[0][7] = {team:' '}
  }
  if (i === 0 && j === 2) {
    board[0][3] = board[0][0]
    board[0][0] = {team:' '}
  }
  return board
}

function swapMode(state) {
  return {
    ...state,
    mode : {"SELECT":"MOVE", "MOVE":"SELECT"}[state.mode]
  }
}


// 'CHANGECOLOR'
function changeColor(state) {
  return {
    ...state,
    color: {"white": "black", "black": "white"}[state.color]
  }
}

// 'BACK'
function back(state) {
  if (state.history.length === 0 || state.history.length === 1) {
    return initialState()
  } else {
    let history = JSON.parse(state.history[state.history.length-2])
    state.history.pop()
    return {
      ...state,
      board        : history.board,
      playerOneJail: history.playerOneJail,
      playerTwoJail: history.playerTwoJail,
    }
  }
}
