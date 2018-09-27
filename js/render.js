function render(state) {
  const {playerOneJail, playerTwoJail, color} = state
  return (
     `<div class="jail">${renderJail(playerOneJail, color)}</div>
     <div id="board">${renderBoard(state)}</div>
     <div class="jail">${renderJail(playerTwoJail, color)}</div>
     ${renderButtons()}`
  )
}

function renderBoard(state) {
  let renderedBoard = ""
  state.board.forEach((row, i) => {
    row.forEach((cell, j) => {
      renderedBoard += renderCell([i, j], cell, state)
    })
  })
  return renderedBoard
}

function renderCell([i, j], cell, state) {
  const {color, moves} = state
  const classList =
    `"cell
    ${getCssClass(cell, color)}
    ${contains(moves, [i, j]) ? "highlight" : ""}
    "`
  let renderedCell =
    `<div
      class=${classList}
      id=${[i, j]}
      onClick="main({type:'CLICK', value:event})"
      onMouseEnter="main({type:'MOUSEENTER', value:event})"
      onMouseLeave="main({type:'MOUSELEAVE', value:event})">
    </div>`

  if (j === 7) renderedCell += `<br />`

  return renderedCell
}

function renderJail(jail, color) {
  let renderedJail = ""
  const jailCell = (pieceClass) => `<div class="jailCell ${pieceClass}"></div>`
  jail.forEach((inmate) => renderedJail += jailCell(getCssClass(inmate, color)))
  return renderedJail
}

function renderButtons() {
  const resetClick = "if(confirm('Reset?'))main({type:'INITIALIZE'})"
  const backClick = "main({type:'BACK'})"
  const colorClick = "main({type:'CHANGECOLOR'})"
  return (
    `<div id="buttons">
      <button type="button" class="button" id="back"  onClick=${backClick}>back</button>
      <button type="button" class="button" id="color" onClick=${colorClick}>white</button>
      <button type="button" class="button" id="reset" onClick=${resetClick}>reset</button>
    </div>`
  )
}
function toggleHoverHighlight(state, action) {
  const piece = getPieceInformation(state, action.value)
  const indexToId = (index) => index[0] + ',' + index[1]
  if (piece.team === "playerOne" && state.mode === "SELECT") {
    const moves = getMoves(state.board, piece)
    moves.forEach((move) => {
      const id = indexToId(move)
      const tile = document.getElementById(id)
      tile.classList.toggle('hoverHighlight')
    })
  }
}

//-----HELPERS-----//
function contains(array, [ii, jj]) {
  return array.some(([i, j]) => i === ii && j === jj)
}

function getCssClass(piece, color) {
  let classColor;
  if (piece.team === " "){
    return ""
  }
  else if (piece.team === "playerOne") {
    classColor = color
  }
  else {
    classColor = {white: "black", black: "white"}[color]
  }
  return camelCase(classColor, piece.type)
}

function camelCase(word1, word2){
  return word1.toLowerCase() + word2.toLowerCase().charAt(0).toUpperCase() + word2.substr(1)
}
