
function range(end, start=0, step=1){
  let arr = []
  
  for (let i = start; i<end; i+=step){
    arr.push(i)
  }
  return arr
}



function GameState(){
  this.Board =
`           
           
  RNBQKBNR 
  PPPPPPPP 
  ........ 
  ........ 
  ........ 
  ........ 
  pppppppp 
  rnbqkbnr 
           
           `
  this.N = -12, this.S = 12, this.E = 1, this.W = -1
  this.Captures = ['P','N', 'B','R','Q','K'] 
  this.color = true


  this.Line = function(Board, position, northOrSouth, eastOrWest, range = 8){
    let legalMoves = []
    for (let i = 1; i<range; i++){
      let checkPos = position + (i*northOrSouth*this.N) + (i*eastOrWest*this.E)
      //console.log("our first check pos is", checkPos, "which has ", Board[checkPos], Board[checkPos] in this.Captures)
      if (Board[checkPos] == ' ' || Board == '\n'){ // we are out of the board
        break
      }
      else if (this.Captures.includes(Board[checkPos])){ // we captured something
        legalMoves.push([position, checkPos])
        break
      }
      else if (Board[checkPos] == '.'){ // we are on a free square
        legalMoves.push([position, checkPos])
      }
      else{ // we are on the same color as self
        break
      }
      
    }
    return legalMoves
  }
  
  this.GenMoves = function(Board, color){
    let forward = -12
    let doubleMoveRow = range(107,98)
    let legalMoves = []
    if (!color) { // we are black
      forward = 12
      doubleMoveRow = range(47,38)
      for (let i = 26; i<118; i++){
        if ((Board[i] == ' ') || (Board == '\n')){
          continue
        }
        else if (this.Captures.includes(Board[i])){ // we are a black piece 
          Board = Board.slice(0,i) + Board[i].toLowerCase() + Board.slice(i+1)
         }
        else{ // we are white
          Board = Board.slice(0,i) + Board[i].toUpperCase() + Board.slice(i+1)
        }
      }
    }
    for (let i = 26; i<118; i++){
      if ((Board[i] == ' ') || (Board == '\n')){
        continue
      }
      else if (Board[i] == 'p'){
        if ((Board[i+forward] == '.' && Board[i + 2*forward] == '.') && (doubleMoveRow.includes(i))){
          legalMoves.push([i,i+forward])
          legalMoves.push([i,i+2*forward])
        }
        else if (Board[i+forward] == '.'){
          legalMoves.push([i,i+forward])
        }
        else if (this.Captures.includes(Board[i+forward+this.E])){
          legalMoves.push([i, i+forward+this.E])
        }
        else if (this.Captures.includes(Board[i+forward+this.W])){
          legalMoves.push([i, i+forward+this.W])
        }
      }
      else if (Board[i] == 'n'){
        for (n of [2*this.N, 2*this.S, 2*this.E, 2*this.W]){
          if ([2*this.N, 2*this.S].includes(n)){
            for (x of [this.E, this.W]){
              if (this.Captures.includes(Board[i+x+n]) || Board[i+x+n] == '.'){
                legalMoves.push([i,i+n+x])
              }
            }
          }
          else if ([2*this.E, 2*this.W].includes(n)){
            for (x of [this.N, this.S]){
              if (this.Captures.includes(Board[i+x+n]) || Board[i+x+n] == '.'){
                legalMoves.push([i,i+n+x])
              }
            }
          }
        }          
        
      }
      
      else if (Board[i] == 'r'){
        let rmoves = [this.Line(Board, i, 1, 0), this.Line(Board, i, -1, 0), this.Line(Board, i, 0, 1), this.Line(Board, i, 0, -1)]
        
        for (moves of rmoves){
          for (move of moves){
            legalMoves.push(move)
          }
        }
      }
      else if (Board[i] == 'b'){
        let bmoves = [this.Line(Board, i, 1, 1), this.Line(Board, i, -1, 1), this.Line(Board, i, 1, -1), this.Line(Board, i, -1, -1)]
        
        for (moves of bmoves){
          for (move of moves){
            legalMoves.push(move)
          }
        }
      }
      else if (Board[i] == 'q'){
        let qmoves = [this.Line(Board, i, 1, 0), this.Line(Board, i, -1, 0), this.Line(Board, i, 0, 1), this.Line(Board, i, 0, -1), 
        this.Line(Board, i, 1, 1), this.Line(Board, i, -1, 1), this.Line(Board, i, 1, -1), this.Line(Board, i, -1, -1)]
        
        for (moves of qmoves){
          for (move of moves){
            legalMoves.push(move)
          }
        }
      }
      else if (Board[i] == 'k'){
        let kmoves = [this.Line(Board, i, 1, 0,2), this.Line(Board, i, -1, 0,2), this.Line(Board, i, 0, 1,2), this.Line(Board, i, 0, -1,2), this.Line(Board, i, 1, 1,2), this.Line(Board, i, -1, 1,2), this.Line(Board, i, 1, -1,2), this.Line(Board, i, -1, -1,2)]
        
        for (moves of kmoves){
          for (move of moves){
            legalMoves.push(move)
          }
        }
      }
    }
    
    return legalMoves
  } 
  
  
  this.MakeMove = function(Board, move){
    const piece = Board[move[0]]
    Board = Board.slice(0,move[0]) + '.' + Board.slice(move[0] + 1)
    Board = Board.slice(0,move[1]) + piece + Board.slice(move[1] +1)
    return Board
  }
   
  this.UndoMove = function(Board, move, startPiece, endPiece){
    Board = Board.slice(0,move[1]) + endPiece + Board.slice(move[1]+1)
    Board = Board.slice(0,move[0]) + startPiece + Board.slice(move[0] + 1)
    return Board
  }

 
}


///////////////////////////////////////////////////
///////        THIS IS THE SEARCHING AND EVALUATING LOGIC
/////////////////////////////////////////////////////////


function SearchAndEval(){
  this.mate = 1000000
  this.pieceValues = {
    'p': 100,
    'n': 300,
    'b': 325,
    'r': 505,
    'q': 969,
    'k': this.mate
  }
  
  
  this.Evaluate = function(Board){
    let sum = 0
    for (let i = 26; i<118; i++){
      if (Board[i] in this.pieceValues){
        sum+= this.pieceValues[Board[i]]
      }
      else if (Board[i].toLowerCase() in this.pieceValues) {
        sum -= this.pieceValues[Board[i].toLowerCase()] 
      }
      
      for (x of [63,64,65,75,76,77]){
        if (Board[x] == 'p'){
          sum += 25
        }
        else if (Board[x] == 'P'){
          sum -= 25
        }
      }
    }
    return sum
  }
  
  this.gameOver = function(Board){
    let k_count = 0
    Board = Board.toLowerCase()
    for (let i = 26; i<118; i++){
      if (Board[i] == 'k'){
        k_count++
      }
    }
    if (k_count == 2){
      return false
    }
    return true
  }
  
  
  this.cache = {}
  this.Search = function(gs, depth, maximizingPlayer){
    const moves = gs.GenMoves(gs.Board,maximizingPlayer)
    //console.log("the moves are \n", moves)
    
    if ((depth == 0) || this.gameOver(gs.Board)){
      //console.log("we are returning, our depth is", depth, "and a game state of", this.gameOver(gs.Board))
      return [this.Evaluate(gs.Board)]
    }
    
    if (maximizingPlayer){ // we are white so we want to maximize our search
      //console.log('tt')
      let maxEval = -1000000
      let bestMove
      for (let i = 0; i<moves.length; i++){
        const move = moves[i]
        const startPiece = gs.Board[move[0]]
        const endPiece = gs.Board[move[1]]
        gs.Board = gs.MakeMove(gs.Board, move)
        const eval = this.Search(gs, depth -1, false)[0]
        gs.Board = gs.UndoMove(gs.Board,move,startPiece,endPiece)
        
        if (eval > maxEval){
          maxEval = eval
          bestMove = move
        }
      }
      //console.log("we are returing a max value of ", maxEval, "and a best move of", bestMove)
      return [maxEval,bestMove]
    }
    else{ // we are black so we try to minimize
      let minEval = 1000000
      let bestMove
      
      for (let i = 0; i<moves.length; i++){
        const move = moves[i]
        const startPiece = gs.Board[move[0]]
        const endPiece = gs.Board[move[1]]
        gs.Board = gs.MakeMove(gs.Board, move)
        const eval = this.Search(gs, depth -1, true)[0]
        gs.Board = gs.UndoMove(gs.Board,move,startPiece,endPiece)
        
        if (eval < minEval){
          minEval = eval
          bestMove = move
        }
      }
      //console.log("we are returing a min value of ", minEval, "and a best move of", bestMove)
      return [minEval,bestMove]
    }
  }
  
  
  
  
  
  
  
  
  
}








const gs = new GameState

const S = new SearchAndEval

//obj.color = false
////console.log(1 in [1,2,3])
//console.log(obj.GenMoves(obj.Board).length)
//
//let string = [3,3]
//
//console.log(obj.Board[117])

for (i of range(10)){
  let moves = gs.GenMoves(gs.Board, gs.color)
  const move = S.Search(gs,4,gs.color)[1]
  console.log("move is", move)
  gs.Board = gs.MakeMove(gs.Board,move)
  gs.color = !gs.color
  console.log(gs.Board)

  
}
//
//console.log('//////')
//console.log(S.Search(gs,1,true))
//
console.log('done')



