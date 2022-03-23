const readline = require('readline');

function readInput() {
    const interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => interface.question("Please provide next input: ", answer => {
        interface.close();
        resolve(answer);
    }))
}





function range(end , start = 0, step = 1) {
  let arr = []

  for (let i = start; i < end; i += step) {
    arr.push(i)
  }
  return arr
}



const rows = [range(118, 110), range(106, 98), range(94, 86), range(82, 74), range(70, 62), range(58, 50), range(46, 38), range(34, 26)]

const columns = [range(120, 26, 12), range(121, 27, 12), range(122, 28, 12), range(123, 29, 12), range(124, 30, 12), range(125, 31, 12), range(126, 32, 12), range(127, 33, 12)]

const colsToLet = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h'
}

const letToCol = {
  'a': 0,
  'b': 1,
  'c': 2,
  'd': 3,
  'e': 4,
  'f': 5,
  'g': 6,
  'h': 7
}



function readableMoves(moves) {
  let readableMoves = []
  let startRow;
  let startCol;
  let endRow;
  let endCol;

  for (move of moves) {
    // check rows
    for (let x = 0; x < 8; x++) {
      if (rows[x].includes(move[0])) {
        startRow = x + 1
      }
      if (rows[x].includes(move[1])) {
        endRow = x + 1
      }
      if (columns[x].includes(move[0])) {
        startCol = colsToLet[x]
      }
      if (columns[x].includes(move[1])) {
        endCol = colsToLet[x]
      }
    }
    let startSquare = startCol + startRow
    let endSquare = endCol + endRow
    readableMoves.push([startSquare, endSquare])
  }


  return readableMoves
}

function readMove(move) {
  let readableMove
  let startNum
  let endNum
  let startRowRange
  let endRowRange
  let endColRange
  let startColRange

  startColRange = columns[letToCol[move[0].slice(0, 1)]]
  startRowRange = rows[parseInt(move[0].slice(1)) - 1]

  endColRange = columns[letToCol[move[1].slice(0, 1)]]
  endRowRange = rows[parseInt(move[1].slice(1)) - 1]

  for (move of startColRange) {
    if (startRowRange.includes(move)) {
      startNum = move
      break
    }
  }

  for (move of endColRange) {
    if (endRowRange.includes(move)) {
      endNum = move
      break
    }
  }

  readableMove = [startNum, endNum]

  return readableMove
}

function rotateString(String) {
  newBoard = Board.slice()
  for (let i = 0; i < Board.length; i++) {
    //console.log("we have i", i, "and Board[len - i]", Board[Board.length -1 - i])
    newBoard = newBoard.slice(0, i) + Board[Board.length - 1 - i] + newBoard.slice(i + 1)
    //console.log('the new board ith pos is ', newBoard[i])
  }

  return newBoard

}




function GameState() {
  
  this.mate = 1000000
  this.pieceValues = {
    'p': 100,
    'n': 300,
    'b': 325,
    'r': 505,
    'q': 969,
    'k': this.mate,
    'P': -100,
    'N': -300,
    'B': -325,
    'R': -505,
    'Q': -969,
    'K': -1 * this.mate
  }
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
  this.N = -12, this.S = 12, this.E = 1, this.W = -1, this.a8 = 26
  this.Captures = ['P', 'N', 'B', 'R', 'Q', 'K']
  this.CapturesBlack = ['p', 'n', 'b', 'r', 'q', 'k']
  this.color = true



  this.Line = function(Board, position, northOrSouth, eastOrWest, range = 8) {
    let legalMoves = []
    for (let i = 1; i < range; i++) {
      let checkPos = position + (i * northOrSouth * this.N) + (i * eastOrWest * this.E)
      //console.log("our first check pos is", checkPos, "which has ", Board[checkPos], Board[checkPos] in this.Captures)
      if (Board[checkPos] == ' ' || Board == '\n') { // we are out of the board
        break
      }
      else if (this.Captures.includes(Board[checkPos])) { // we captured something
        legalMoves.push([position, checkPos])
        break
      }
      else if (Board[checkPos] == '.') { // we are on a free square
        legalMoves.push([position, checkPos])
      }
      else { // we are on the same color as self
        break
      }

    }
    return legalMoves
  }
  
  
  this.LineBlack = function(Board, position, northOrSouth, eastOrWest, range = 8) {
    let legalMoves = []
    for (let i = 1; i < range; i++) {
      let checkPos = position + (i * northOrSouth * this.N) + (i * eastOrWest * this.E)
      //console.log("our first check pos is", checkPos, "which has ", Board[checkPos], Board[checkPos] in this.Captures)
      if (Board[checkPos] == ' ' || Board == '\n') { // we are out of the board
        break
      }
      else if (this.CapturesBlack.includes(Board[checkPos])) { // we captured something
        legalMoves.push([position, checkPos])
        break
      }
      else if (Board[checkPos] == '.') { // we are on a free square
        legalMoves.push([position, checkPos])
      }
      else { // we are on the same color as self
        break
      }

    }
    return legalMoves
  }

  this.GenMoves = function(Board, color) {
    let forward = -12
    let doubleMoveRow = range(107, 98)
    let legalMoves = []
    if (!color) { // we are black
      forward = 12
      doubleMoveRow = range(47, 38)
      for (let i = 26; i < 118; i++) {
        if ((Board[i] == ' ') || (Board[i] == '\n')) {
          continue
        }
        else if (Board[i] == 'P') {
          if ((Board[i + forward] == '.' && Board[i + 2 * forward] == '.') && (doubleMoveRow.includes(i))) {
            legalMoves.push([i, i + forward])
            legalMoves.push([i, i + 2 * forward])
          }
          else if (Board[i + forward] == '.') {
            legalMoves.push([i, i + forward])
          }
          if (this.CapturesBlack.includes(Board[i + forward + this.E])) {
            legalMoves.push([i, i + forward + this.E])
          }
          if (this.CapturesBlack.includes(Board[i + forward + this.W])) {
            legalMoves.push([i, i + forward + this.W])
          }
        }
        else if (Board[i] == 'N') {
          for (n of [2 * this.N, 2 * this.S, 2 * this.E, 2 * this.W]) {
            if ([2 * this.N, 2 * this.S].includes(n)) {
              for (x of [this.E, this.W]) {
                if (this.CapturesBlack.includes(Board[i + x + n]) || Board[i + x + n] == '.') {
                  legalMoves.push([i, i + n + x])
                }
              }
            }
            else if ([2 * this.E, 2 * this.W].includes(n)) {
              for (x of [this.N, this.S]) {
                if (this.CapturesBlack.includes(Board[i + x + n]) || Board[i + x + n] == '.') {
                  legalMoves.push([i, i + n + x])
                }
              }
            }
          }
  
        }
  
        else if (Board[i] == 'R') {
          let rmoves = [this.LineBlack(Board, i, 1, 0), this.LineBlack(Board, i, -1, 0), this.LineBlack(Board, i, 0, 1), this.LineBlack(Board, i, 0, -1)]
  
          for (moves of rmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
        else if (Board[i] == 'B') {
          let bmoves = [this.LineBlack(Board, i, 1, 1), this.LineBlack(Board, i, -1, 1), this.LineBlack(Board, i, 1, -1), this.LineBlack(Board, i, -1, -1)]
  
          for (moves of bmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
        else if (Board[i] == 'Q') {
          let qmoves = [this.LineBlack(Board, i, 1, 0), this.LineBlack(Board, i, -1, 0), this.LineBlack(Board, i, 0, 1), this.LineBlack(Board, i, 0, -1),
          this.LineBlack(Board, i, 1, 1), this.LineBlack(Board, i, -1, 1), this.LineBlack(Board, i, 1, -1), this.LineBlack(Board, i, -1, -1)]
  
          for (moves of qmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
        else if (Board[i] == 'K') {
          let kmoves = [this.LineBlack(Board, i, 1, 0, 2), this.LineBlack(Board, i, -1, 0, 2), this.LineBlack(Board, i, 0, 1, 2), this.LineBlack(Board, i, 0, -1, 2), this.LineBlack(Board, i, 1, 1, 2), this.LineBlack(Board, i, -1, 1, 2), this.LineBlack(Board, i, 1, -1, 2), this.LineBlack(Board, i, -1, -1, 2)]
  
          for (moves of kmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
      }
     
    }
    
    
    else // we are white
    {
      for (let i = 26; i < 118; i++) {
        if ((Board[i] == ' ') || (Board[i] == '\n')) {
          continue
        }
        else if (Board[i] == 'p') {
          if ((Board[i + forward] == '.' && Board[i + 2 * forward] == '.') && (doubleMoveRow.includes(i))) {
            legalMoves.push([i, i + forward])
            legalMoves.push([i, i + 2 * forward])
          }
          else if (Board[i + forward] == '.') {
            legalMoves.push([i, i + forward])
          }
          if (this.Captures.includes(Board[i + forward + this.E])) {
            legalMoves.push([i, i + forward + this.E])
          }
          if (this.Captures.includes(Board[i + forward + this.W])) {
            legalMoves.push([i, i + forward + this.W])
          }
        }
        else if (Board[i] == 'n') {
          for (n of [2 * this.N, 2 * this.S, 2 * this.E, 2 * this.W]) {
            if ([2 * this.N, 2 * this.S].includes(n)) {
              for (x of [this.E, this.W]) {
                if (this.Captures.includes(Board[i + x + n]) || Board[i + x + n] == '.') {
                  legalMoves.push([i, i + n + x])
                }
              }
            }
            else if ([2 * this.E, 2 * this.W].includes(n)) {
              for (x of [this.N, this.S]) {
                if (this.Captures.includes(Board[i + x + n]) || Board[i + x + n] == '.') {
                  legalMoves.push([i, i + n + x])
                }
              }
            }
          }
  
        }
  
        else if (Board[i] == 'r') {
          let rmoves = [this.Line(Board, i, 1, 0), this.Line(Board, i, -1, 0), this.Line(Board, i, 0, 1), this.Line(Board, i, 0, -1)]
  
          for (moves of rmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
        else if (Board[i] == 'b') {
          let bmoves = [this.Line(Board, i, 1, 1), this.Line(Board, i, -1, 1), this.Line(Board, i, 1, -1), this.Line(Board, i, -1, -1)]
  
          for (moves of bmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
        else if (Board[i] == 'q') {
          let qmoves = [this.Line(Board, i, 1, 0), this.Line(Board, i, -1, 0), this.Line(Board, i, 0, 1), this.Line(Board, i, 0, -1),
          this.Line(Board, i, 1, 1), this.Line(Board, i, -1, 1), this.Line(Board, i, 1, -1), this.Line(Board, i, -1, -1)]
  
          for (moves of qmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
        else if (Board[i] == 'k') {
          let kmoves = [this.Line(Board, i, 1, 0, 2), this.Line(Board, i, -1, 0, 2), this.Line(Board, i, 0, 1, 2), this.Line(Board, i, 0, -1, 2), this.Line(Board, i, 1, 1, 2), this.Line(Board, i, -1, 1, 2), this.Line(Board, i, 1, -1, 2), this.Line(Board, i, -1, -1, 2)]
  
          for (moves of kmoves) {
            for (move of moves) {
              legalMoves.push(move)
            }
          }
        }
      }
    }

    return legalMoves
  }








  this.MakeMove = function(Board, move) {
    const piece = Board[move[0]]
    Board = Board.slice(0, move[0]) + '.' + Board.slice(move[0] + 1)
    Board = Board.slice(0, move[1]) + piece + Board.slice(move[1] + 1)
    return Board
  }

  this.UndoMove = function(Board, move, startPiece, endPiece) {
    Board = Board.slice(0, move[1]) + endPiece + Board.slice(move[1] + 1)
    Board = Board.slice(0, move[0]) + startPiece + Board.slice(move[0] + 1)
    return Board
  }


}


///////////////////////////////////////////////////
///////        THIS IS THE SEARCHING AND EVALUATING LOGIC
/////////////////////////////////////////////////////////


function SearchAndEval() {
  this.mate = 1000000
  this.pieceValues = {
    'p': 100,
    'n': 300,
    'b': 325,
    'r': 505,
    'q': 969,
    'k': this.mate,
    'P': -100,
    'N': -300,
    'B': -325,
    'R': -505,
    'Q': -969,
    'K': -1 * this.mate
  }




  this.pst = {
    'p': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 78, 83, 86, 73, 102, 82, 85, 90, 0, 0,
      0, 0, 7, 29, 21, 44, 40, 31, 44, 7, 0, 0,
      0, 0, -17, 16, -2, 15, 14, 0, 15, -13, 0, 0,
      0, 0, -26, 3, 10, 9, 6, 1, 0, -23, 0, 0,
      0, 0, -22, 9, 5, -11, -10, -2, 3, -19, 0, 0,
      0, 0, -31, 8, -7, -37, -36, -14, 3, -31, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],



    'P': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -31, 8, -7, -37, -36, -14, 3, -31, 0, 0,
      0, 0, -22, 9, 5, -11, -10, -2, 3, -19, 0, 0,
      0, 0, -26, 3, 10, 9, 6, 1, 0, -23, 0, 0,
      0, 0, -17, 16, -2, 15, 14, 0, 15, -13, 0, 0,
      0, 0, 7, 29, 21, 44, 40, 31, 44, 7, 0, 0,
      0, 0, 78, 83, 86, 73, 102, 82, 85, 90, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],



    'n': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -66, -53, -75, -75, -10, -55, -58, -70, 0, 0,
      0, 0, -3, -6, 100, -36, 4, 62, -4, -14, 0, 0,
      0, 0, 10, 67, 1, 74, 73, 27, 62, -2, 0, 0,
      0, 0, 24, 24, 45, 37, 33, 41, 25, 17, 0, 0,
      0, 0, -1, 5, 31, 21, 22, 35, 2, 0, 0, 0,
      0, 0, -18, 10, 13, 22, 18, 15, 11, -14, 0, 0,
      0, 0, -23, -15, 2, 0, 2, 0, -23, -20, 0, 0,
      0, 0, -74, -23, -26, -24, -19, -35, -22, -69, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


    'N': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -74, -23, -26, -24, -19, -35, -22, -69, 0, 0,
      0, 0, -23, -15, 2, 0, 2, 0, -23, -20, 0, 0,
      0, 0, -18, 10, 13, 22, 18, 15, 11, -14, 0, 0,
      0, 0, -1, 5, 31, 21, 22, 35, 2, 0, 0, 0,
      0, 0, 24, 24, 45, 37, 33, 41, 25, 17, 0, 0,
      0, 0, 10, 67, 1, 74, 73, 27, 62, -2, 0, 0,
      0, 0, -3, -6, 100, -36, 4, 62, -4, -14, 0, 0,
      0, 0, -66, -53, -75, -75, -10, -55, -58, -70, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],



    'b': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -59, -78, -82, -76, -23, -107, -37, -50, 0, 0,
      0, 0, -11, 20, 35, -42, -39, 31, 2, -22, 0, 0,
      0, 0, -9, 39, -32, 41, 52, -10, 28, -14, 0, 0,
      0, 0, 25, 17, 20, 34, 26, 25, 15, 10, 0, 0,
      0, 0, 13, 10, 17, 23, 17, 16, 0, 7, 0, 0,
      0, 0, 14, 25, 24, 15, 8, 25, 20, 15, 0, 0,
      0, 0, 19, 20, 11, 6, 7, 6, 20, 16, 0, 0,
      0, 0, -7, 2, -15, -12, -14, -15, -10, -10, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


    'B': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -7, 2, -15, -12, -14, -15, -10, -10, 0, 0,
      0, 0, 19, 20, 11, 6, 7, 6, 20, 16, 0, 0,
      0, 0, 14, 25, 24, 15, 8, 25, 20, 15, 0, 0,
      0, 0, 13, 10, 17, 23, 17, 16, 0, 7, 0, 0,
      0, 0, 25, 17, 20, 34, 26, 25, 15, 10, 0, 0,
      0, 0, -9, 39, -32, 41, 52, -10, 28, -14, 0, 0,
      0, 0, -11, 20, 35, -42, -39, 31, 2, -22, 0, 0,
      0, 0, -59, -78, -82, -76, -23, -107, -37, -50, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


    'r': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 35, 29, 33, 4, 37, 33, 56, 50, 0, 0,
      0, 0, 55, 29, 56, 67, 55, 62, 34, 60, 0, 0,
      0, 0, 19, 35, 28, 33, 45, 27, 25, 15, 0, 0,
      0, 0, 0, 5, 16, 13, 18, -4, -9, -6, 0, 0,
      0, 0, -28, -35, -16, -21, -13, -29, -46, -30, 0, 0,
      0, 0, -42, -28, -42, -25, -25, -35, -26, -46, 0, 0,
      0, 0, -53, -38, -31, -26, -29, -43, -44, -53, 0, 0,
      0, 0, -30, -24, -18, 5, -2, -18, -31, -32, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'R': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -30, -24, -18, 5, -2, -18, -31, -32, 0, 0,
      0, 0, -53, -38, -31, -26, -29, -43, -44, -53, 0, 0,
      0, 0, -42, -28, -42, -25, -25, -35, -26, -46, 0, 0,
      0, 0, -28, -35, -16, -21, -13, -29, -46, -30, 0, 0,
      0, 0, 0, 5, 16, 13, 18, -4, -9, -6, 0, 0,
      0, 0, 19, 35, 28, 33, 45, 27, 25, 15, 0, 0,
      0, 0, 55, 29, 56, 67, 55, 62, 34, 60, 0, 0,
      0, 0, 35, 29, 33, 4, 37, 33, 56, 50, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


    'q': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 6, 1, -8, -104, 69, 24, 88, 26, 0, 0,
      0, 0, 14, 32, 60, -10, 20, 76, 57, 24, 0, 0,
      0, 0, -2, 43, 32, 60, 72, 63, 43, 2, 0, 0,
      0, 0, 1, -16, 22, 17, 25, 20, -13, -6, 0, 0,
      0, 0, -14, -15, -2, -5, -1, -10, -20, -22, 0, 0,
      0, 0, -30, -6, -13, -11, -16, -11, -16, -27, 0, 0,
      0, 0, -36, -18, 0, -19, -15, -15, -21, -38, 0, 0,
      0, 0, -39, -30, -31, -13, -31, -36, -34, -42, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Q': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -39, -30, -31, -13, -31, -36, -34, -42, 0, 0,
      0, 0, -36, -18, 0, -19, -15, -15, -21, -38, 0, 0,
      0, 0, -30, -6, -13, -11, -16, -11, -16, -27, 0, 0,
      0, 0, -14, -15, -2, -5, -1, -10, -20, -22, 0, 0,
      0, 0, 1, -16, 22, 17, 25, 20, -13, -6, 0, 0,
      0, 0, -2, 43, 32, 60, 72, 63, 43, 2, 0, 0,
      0, 0, 14, 32, 60, -10, 20, 76, 57, 24, 0, 0,
      0, 0, 6, 1, -8, -104, 69, 24, 88, 26, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'k': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 4, 54, 47, -99, -99, 60, 83, -62, 0, 0,
      0, 0, -32, 10, 55, 56, 56, 55, 10, 3, 0, 0,
      0, 0, -62, 12, -57, 44, -67, 28, 37, -31, 0, 0,
      0, 0, -55, 50, 11, -4, -19, 13, 0, -49, 0, 0,
      0, 0, -55, -43, -52, -28, -51, -47, -8, -50, 0, 0,
      0, 0, -47, -42, -43, -79, -64, -32, -29, -32, 0, 0,
      0, 0, -4, 3, -14, -50, -57, -18, 13, 4, 0, 0,
      0, 0, 17, 30, -3, -14, 6, -1, 40, 18, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'K': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 17, 30, -3, -14, 6, -1, 40, 18, 0, 0,
      0, 0, -4, 3, -14, -50, -57, -18, 13, 4, 0, 0,
      0, 0, -47, -42, -43, -79, -64, -32, -29, -32, 0, 0,
      0, 0, -55, -43, -52, -28, -51, -47, -8, -50, 0, 0,
      0, 0, -55, 50, 11, -4, -19, 13, 0, -49, 0, 0,
      0, 0, -62, 12, -57, 44, -67, 28, 37, -31, 0, 0,
      0, 0, -32, 10, 55, 56, 56, 55, 10, 3, 0, 0,
      0, 0, 4, 54, 47, -99, -99, 60, 83, -62, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
  // need some way to turn board value into array number. 
  // B(26) = 
  this.Captures = ['P', 'N', 'B', 'R', 'Q', 'K']
  this.Evaluate = function(Board) {
    let sum = 0

    for (let i = 26; i < 118; i++) {
      if (!(Board[i] in this.pieceValues))
      {
        //console.log(`the square was ${Board[i]}`)
        continue
      }
      else if (Board[i] == Board[i].toLowerCase()) {

        sum += this.pieceValues[Board[i]]
        sum += this.pst[Board[i]][i]

      }
      else {
       
        sum += this.pieceValues[Board[i]]
        sum -= this.pst[Board[i]][i]

      }

    }
    return sum
  }


  this.gameOver = function(Board) {
    let k_count = 0
    Board = Board.toLowerCase()
    for (let i = 26; i < 118; i++) {
      if (Board[i] == 'k') {
        k_count++
      }
    }
    if (k_count == 2) {
      return false
    }
    return true
  }



  this.currentSearchInfo = {
    "nodes": 0,
    "cache": {},
    "history": []
  }
  this.sortMoves = function(Board, moves) {
    const pieces = ['p','n','b','r','q','k','P','N','B','R','Q','K']
    
    let movesWithValues = []
    
    let toSplice = []
    
    // run a primitive 1 depth search on moves

    for (let i = 0; i < moves.length; i++) {
      if (Board[moves[i][1]] != '.')
      { // then this is a capture so move to front
        //console.log(moves[i])
        toSplice.push(i)
//        moves.unshift(tempArr[i])
        const diff = Math.abs(this.pieceValues[Board[moves[i][1]]]) - Math.abs(this.pieceValues[Board[moves[i][0]]])
        const moveWithDiff = [moves[i], diff]
        movesWithValues.push(moveWithDiff)
      }
    }

    let tempVal1
    let sortedMoves = []
    // now sort the moves 
    for (let i = 0; i<movesWithValues.length-1; i++)
      for (let x = i+1; x<movesWithValues.length; x++)
      {
        let min = movesWithValues[i][1]
        let pos = i 
        {
          
          if (movesWithValues[x][1] <= min)
          {
            pos = x
            min = movesWithValues[x][1]
            
          }
        }
        if (i != pos)
        {
          tempVal1 = movesWithValues[i]
          movesWithValues[i] = movesWithValues[pos]
          movesWithValues[pos] = tempVal1
        }
        moves.splice(toSplice[i],1)
        sortedMoves.push(movesWithValues[i][0])
      }
    
   for (move of movesWithValues)
   {
     moves.unshift(move[0])
   }

    return moves
  }
  
  this.principleVar = []

  this.transTable = {
    
  }
  this.Search = function(gs, depth, alpha, beta, maximizingPlayer, iterMove = 0) {
    //let moves = S.sortMoves(gs.Board,gs.GenMoves(gs.Board, maximizingPlayer))
    let moves = gs.GenMoves(gs.Board,maximizingPlayer)


    if (iterMove != 0) {

      const index = moves.indexOf(iterMove)


      moves.splice(index, 1)

      moves.unshift(iterMove)

    }
 


    

    if ((depth == 0) || this.gameOver(gs.Board)) {
     
      return [this.Evaluate(gs.Board), []]
    }

    if (maximizingPlayer) { // we are white so we want to maximize our search

      let maxEval = -1000000
      let bestMove 
      let moveList =[]
      let searchInfo
      for (let i = 0; i < moves.length; i++) {

        const move = moves[i]
        const startPiece = gs.Board[move[0]]
        const endPiece = gs.Board[move[1]]
        gs.Board = gs.MakeMove(gs.Board, move)

        let eval




        // const eval = this.Search(gs, depth - 1, alpha, beta, false)[0]
        if (gs.Board in this.transTable)
        { // we are inside the table
          searchInfo = this.transTable[gs.Board]
          eval = searchInfo[0]

           
        }
        else
        { // we are no in the transpition table
       
          searchInfo = this.Search(gs, depth - 1, alpha, beta, false)
          eval = searchInfo[0]
          
          
          // need to add position and eval to table
          
          
          this.transTable[gs.Board] = [eval,searchInfo[1]]
        }



       

        gs.Board = gs.UndoMove(gs.Board, move, startPiece, endPiece)

        if (eval > maxEval) {
          maxEval = eval
          bestMove = move
          moveList = searchInfo[1]
        }
        if (eval > alpha) {
          alpha = eval
        }
        if (beta <= alpha) {
          break
        }
      }
      moveList.unshift(bestMove)
      return [maxEval,moveList]
    }
    else { // we are black so we try to minimize
      let minEval = 1000000
      let bestMove 
      let moveList =[]
      let searchInfo

      for (let i = 0; i < moves.length; i++) {
        this.currentSearchInfo.nodes++
        const move = moves[i]
        const startPiece = gs.Board[move[0]]
        const endPiece = gs.Board[move[1]]
        gs.Board = gs.MakeMove(gs.Board, move)
        let eval

        
        
        
        
        
        if (gs.Board in this.transTable)
        { // we are inside the table
          searchInfo = this.transTable[gs.Board]
          eval = searchInfo[0]
          searchInfo[1].pop()
        }
        else
        { // we are no in the transpition table
       
          searchInfo = this.Search(gs, depth - 1, alpha, beta, true)
          eval = searchInfo[0]
          
          // need to add position and eval to table
          this.transTable[gs.Board] = [eval, searchInfo[1]]
        }        
        
        
       
        
        

        gs.Board = gs.UndoMove(gs.Board, move, startPiece, endPiece)

        if (eval < minEval) {
          minEval = eval
          bestMove = move
          movesList = searchInfo[1]
        }
        if (beta <= eval) {
          beta = eval
          //this.principleVar.push(move)
        }
        if (beta <= alpha) {
          break
        }
      }

      moveList.unshift(bestMove)
      return [minEval, moveList]

    }
  }

  

  this.IterarativeDeepening = function(gs, alpha, beta, maximizingPlayer, time) {
    const startTime = new Date().getTime()
    let move = 0
    
    for (let currentDepth = 1; ; currentDepth++) {
     
      this.transTable = {}
      this.principleVar = []
      
      const search = this.Search(gs, currentDepth, alpha, beta, maximizingPlayer, move) // returns a eval and a move
     
      moves = search[1]
      move = moves[0]
      const eval = search[0]
      console.log(`the move list is`)
      console.log(readableMoves(moves))
      console.log(`the depth is ${currentDepth}, the best move ${readableMoves([move])}, and the eval of the best move is ${eval}`)
      //console.log(`the potential principle variation is ${this.principleVar}`)
      //console.log('search is ', search)
      //maximizingPlayer = !maximizingPlayer


      var endTime = new Date().getTime()
      if (endTime - startTime > time || currentDepth == 5) {
        console.log("this took us", (endTime - startTime) / 1000, "seconds")
        return move
      }
    }

  }








}







function humanMoveMaker(string) {
  let startSquare
  let endSquare
  startSquare = string.slice(0, 2)
  endSquare = string.slice(3)

  return [startSquare, endSquare]
}




//gs.Board = gs.MakeMove(gs.Board, readMove(['e2','e4']))
//
//gs.Board = gs.MakeMove(gs.Board,readMove(['d7','d5']))
//
//gs.Board = gs.MakeMove(gs.Board, readMove(['g8','f5']))
//
//gs.Board =gs.MakeMove(gs.Board, readMove(['b1','c3']))
//
//console.log(gs.Board)


//console.log(readableMoves(S.sortMoves(gs.Board,gs.GenMoves(gs.Board, true))))
//console.log(readableMoves(gs.GenMoves(gs.Board, true)))



const gs = new GameState()

const S = new SearchAndEval()

//console.log(gs.Board[25] == gs.Board[25].toLowerCase())
//console.log(S.Evaluate(gs.Board))

//let computerMoves = S.IterarativeDeepening(gs, -2 * S.mate, 2 * S.mate, true, 1000)

async function loop()
{
  while (true) {
    let computerMove = S.IterarativeDeepening(gs, -2 * S.mate, 2 * S.mate, true, 1000)
    //console.log(readableMoves(gs.GenMoves(gs.Board,true)))
    //console.log(readableMoves(S.sortMoves(gs.Board, gs.GenMoves(gs.Board, true))))
            
  
    gs.Board = gs.MakeMove(gs.Board, computerMove)
  
    // player gameloop
    console.log(gs.Board)
    const playerMove = await readInput()
    let stringArrayMove = humanMoveMaker(playerMove)
    let computerReadableMove = readMove(stringArrayMove)
    //console.log(computerReadableMove)
    gs.Board = gs.MakeMove(gs.Board, computerReadableMove)
  }
  
}

loop()





// Our mvvlva take a while to run. will still speed up engine in messy positions. But a more practical way to get the information is to just store the attacked pieces when generating moves. And the attacker. So we could return moves = [[startsq, endsq, value difference]] so then we already have the value difference for each move and only have to sort them. Could also have a bunch of this.arrays 
// which live sort the moves. e.g. this.movesdiff = ~8, would be moves where a pawn take a queen since 9 - 1 = 8. 
