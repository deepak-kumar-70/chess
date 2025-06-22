export const getPawnMoves = (rowInd, colInd, board, isWhite = true) => {
  console.log('getPawnMoves called', rowInd, colInd, isWhite);
  const moves = [];
  const dir = isWhite ? -1 : 1;
  const startRow = isWhite ? 6 : 1;

  const oneStep = board[rowInd + dir]?.[colInd];
  const twoSteps = board[rowInd + 2 * dir]?.[colInd];

  if (oneStep === null) {
    moves.push([rowInd + dir, colInd]);

   
    if (rowInd === startRow && twoSteps === null) {
      moves.push([rowInd + 2 * dir, colInd]);
    }
  }

  
  const leftDiagonal = board[rowInd + dir]?.[colInd - 1];
  if (
    leftDiagonal &&
    ((isWhite && leftDiagonal === leftDiagonal.toLowerCase()) ||
      (!isWhite && leftDiagonal === leftDiagonal.toUpperCase()))
  ) {
    moves.push([rowInd + dir, colInd - 1]);
  }

 
  const rightDiagonal = board[rowInd + dir]?.[colInd + 1];
  if (
    rightDiagonal &&
    ((isWhite && rightDiagonal === rightDiagonal.toLowerCase()) ||
      (!isWhite && rightDiagonal === rightDiagonal.toUpperCase()))
  ) {
    moves.push([rowInd + dir, colInd + 1]);
  }

  return moves;
};
export const getBishopMoves = (rowInd, colInd, board, isWhite = true) => {
  const moves = [];
  const directions = [
    [-1, -1], // ↖
    [-1, 1],  // ↗
    [1, -1],  // ↙
    [1, 1],   // ↘
  ];

  for (let [dr, dc] of directions) {
    let r = rowInd + dr;
    let c = colInd + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];

      if (target === null) {
        moves.push([r, c]);
      } else {
        const isTargetWhite = target === target.toUpperCase();
        if (isWhite !== isTargetWhite) {
          moves.push([r, c]); // capture
        }
        break; // cannot jump past any piece
      }

      r += dr;
      c += dc;
    }
  }

  return moves;
};

export const getRookMoves = (rowInd, colInd, board, isWhite = true) => {
  const moves = [];
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1],  // Right
  ];

  for (let [dr, dc] of directions) {
    let r = rowInd + dr;
    let c = colInd + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];

      if (target === null) {
        moves.push([r, c]);
      } else {
        const isTargetWhite = target === target.toUpperCase();
        if (isWhite !== isTargetWhite) {
          moves.push([r, c]); // capture
        }
        break; // cannot jump past any piece
      }

      r += dr;
      c += dc;
    }
  }

  return moves;
}

export const getKnightMoves = (rowInd, colInd, board, isWhite = true) => {
  const moves = [];
  const knightMoves = [
    [-2, -1], [-2, 1], // Up two, left/right one
    [2, -1], [2, 1],   // Down two, left/right one
    [-1, -2], [-1, 2], // Left two, up/down one
    [1, -2], [1, 2]    // Right two, up/down one
  ];

  for (let [dr, dc] of knightMoves) {
    const r = rowInd + dr;
    const c = colInd + dc;

    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (target === null || (isWhite !== (target === target.toUpperCase()))) {
        moves.push([r, c]);
      }
    }
  }

  return moves;
}

export const getQueenMoves = (rowInd, colInd, board, isWhite = true) => {
  const moves = [];
  const directions = [
    [-1, -1], // ↖
    [-1, 0],  // Up
    [-1, 1],  // ↗
    [0, -1],  // Left
    [0, 1],   // Right
    [1, -1],  // ↙
    [1, 0],   // Down
    [1, 1],   // ↘
  ];

  for (let [dr, dc] of directions) {
    let r = rowInd + dr;
    let c = colInd + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];

      if (target === null) {
        moves.push([r, c]);
      } else {
        const isTargetWhite = target === target.toUpperCase();
        if (isWhite !== isTargetWhite) {
          moves.push([r, c]); // capture
        }
        break; // cannot jump past any piece
      }

      r += dr;
      c += dc;
    }
  }

  return moves;
}

export const getKingMoves = (rowInd, colInd, board, isWhite = true) => {
  const moves = [];
  const kingMoves = [
    [-1, -1], [-1, 0], [-1, 1], // Up
    [0, -1],           [0, 1],   // Left/Right
    [1, -1], [1, 0], [1, 1]     // Down
  ];

  for (let [dr, dc] of kingMoves) {
    const r = rowInd + dr;
    const c = colInd + dc;

    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (target === null || (isWhite !== (target === target.toUpperCase()))) {
        moves.push([r, c]);
      }
    }
  }

  return moves;
}