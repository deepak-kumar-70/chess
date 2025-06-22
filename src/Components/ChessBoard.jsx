import React from "react";
import { useState } from "react";
import { initialBoard } from "./utilities/initialboard";
import pieces from "./utilities/ChessPieaces";
import {
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
  getBishopMoves,
} from "./utilities/PieaceMove";
import socket from "./utilities/socket";
import { useEffect } from "react";
const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [turn, setTurn] = useState("white");
  const [moveCount, setMoveCount] = useState(0);
  const [checkPosition, setCheckPosition] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");

  useEffect(() => {
    socket.on("room:joined", ({ name, color }) => {
      setPlayerColor(color);
      setPlayerName(name);
    });

    socket.on("player:joined", ({ name, color }) => {
      if (color !== playerColor) setOpponentName(name);
    });

    socket.on("move:update", ({ board: newBoard, turn }) => {
      setBoard(newBoard);
      setSelectedPiece(null);
      setPossibleMoves([]);
      setTurn(turn);
    });

    socket.on("game:over", ({ winner }) => {
      setGameOver(true);
      setWinner(winner);
    });

    return () => {
      socket.off("room:joined");
      socket.off("player:joined");
      socket.off("move:update");
      socket.off("game:over");
    };
  }, [playerColor]);

  const handleMove = (rowIdx, colIdx) => {
    const clickedPiece = board[rowIdx][colIdx];
    const isLegal = possibleMoves.some(([r, c]) => r === rowIdx && c === colIdx);

    if (selectedPiece && isLegal) {
      const newBoard = board.map((row) => [...row]);
      newBoard[rowIdx][colIdx] = selectedPiece.key;
      newBoard[selectedPiece.row][selectedPiece.col] = null;

      const nextTurn = turn === "white" ? "black" : "white";
      const isWhiteTurn = nextTurn === "white";
      const isCheck = isInCheck(newBoard, isWhiteTurn);
      const noMoves = !hasLegalMoves(newBoard, isWhiteTurn);

      setBoard(newBoard);
      setSelectedPiece(null);
      setPossibleMoves([]);
      setMoveCount(moveCount + 1);
      setTurn(nextTurn);
      setCheckPosition(isCheck ? findKingPosition(newBoard, isWhiteTurn) : null);

      socket.emit("move:made", {
        from: [selectedPiece.row, selectedPiece.col],
        to: [rowIdx, colIdx],
        board: newBoard,
        turn: nextTurn,
      });

      if (isCheck && noMoves) {
        setGameOver(true);
        setWinner(turn);
        socket.emit("game:over", { winner: turn });
      } else if (!isCheck && noMoves) {
        setGameOver(true);
        setWinner("draw");
        socket.emit("game:over", { winner: "draw" });
      }
    } else if (clickedPiece) {
      const isWhite = clickedPiece === clickedPiece.toUpperCase();
      if ((turn === "white" && isWhite) || (turn === "black" && !isWhite)) {
        setSelectedPiece({ row: rowIdx, col: colIdx, key: clickedPiece });

        const lower = clickedPiece.toLowerCase();
        let moves = [];
        if (lower === "p") moves = getPawnMoves(rowIdx, colIdx, board, isWhite);
        else if (lower === "b") moves = getBishopMoves(rowIdx, colIdx, board, isWhite);
        else if (lower === "r") moves = getRookMoves(rowIdx, colIdx, board, isWhite);
        else if (lower === "n") moves = getKnightMoves(rowIdx, colIdx, board, isWhite);
        else if (lower === "q") moves = getQueenMoves(rowIdx, colIdx, board, isWhite);
        else if (lower === "k") moves = getKingMoves(rowIdx, colIdx, board, isWhite);

        const legalMoves = moves.filter(([mr, mc]) => {
          const copy = board.map(row => [...row]);
          copy[mr][mc] = clickedPiece;
          copy[rowIdx][colIdx] = null;
          return !isInCheck(copy, isWhite);
        });

        setPossibleMoves(legalMoves);
      }
    } else {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  return (
    <div>
      {playerColor && (
        <div className="mb-4 text-center text-white">
          You are <span className="font-bold capitalize">{playerColor}</span> ({playerName})
          {opponentName && ` vs ${opponentName}`}
        </div>
      )}
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black p-6 z-10">
          <h2 className="text-xl font-bold">Game Over</h2>
          <p>{winner === "draw" ? "Stalemate!" : `${winner} wins by checkmate!`}</p>
        </div>
      )}
      <div className="w-[640px] h-[640px] border-2 border-[rgba(0,0,0,0.6)]">
        {board.map((rowArr, rowIdx) => (
          <div key={rowIdx} className="flex">
            {rowArr.map((pieceKey, colIdx) => {
              const isSelected = selectedPiece?.row === rowIdx && selectedPiece?.col === colIdx;
              const isPossibleMove = possibleMoves.some(([r, c]) => r === rowIdx && c === colIdx);
              const isCheck = checkPosition?.[0] === rowIdx && checkPosition?.[1] === colIdx;

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleMove(rowIdx, colIdx)}
                  className={`h-[80px] w-[80px] flex justify-center items-center cursor-pointer ${
                    (rowIdx + colIdx) % 2 === 0 ? "bg-slate-400" : "bg-neutral-800"
                  } ${isSelected ? "border-2 border-neutral-100" : ""} ${
                    isPossibleMove ? "border-2 border-neutral-300" : ""
                  } ${isCheck ? "border-2 border-red-600" : ""}`}
                >
                  {pieces.map((piece) => {
                    if (piece.key === pieceKey) {
                      const Icon = piece.icon;
                      const isWhite = piece.key === piece.key.toUpperCase();
                      return (
                        <Icon
                          key={piece.key}
                          className={`text-[40px] ${isWhite ? "text-white" : "text-slate-950"}`}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;

// ==================== Checkmate Utility Functions ====================

export const findKingPosition = (board, isWhite) => {
  const king = isWhite ? "K" : "k";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === king) return [r, c];
    }
  }
  return null;
};

export const isSquareAttacked = (board, row, col, attackerIsWhite) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const isWhite = piece === piece.toUpperCase();
      if (isWhite !== attackerIsWhite) continue;

      const lower = piece.toLowerCase();
      let moves = [];
      if (lower === "p") moves = getPawnMoves(r, c, board, attackerIsWhite);
      else if (lower === "r") moves = getRookMoves(r, c, board, attackerIsWhite);
      else if (lower === "n") moves = getKnightMoves(r, c, board, attackerIsWhite);
      else if (lower === "b") moves = getBishopMoves(r, c, board, attackerIsWhite);
      else if (lower === "q") moves = getQueenMoves(r, c, board, attackerIsWhite);
      else if (lower === "k") moves = getKingMoves(r, c, board, attackerIsWhite);

      if (moves.some(([mr, mc]) => mr === row && mc === col)) return true;
    }
  }
  return false;
};

export const isInCheck = (board, isWhite) => {
  const [r, c] = findKingPosition(board, isWhite);
  return isSquareAttacked(board, r, c, !isWhite);
};

export const hasLegalMoves = (board, isWhite) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      if ((piece === piece.toUpperCase()) !== isWhite) continue;

      const lower = piece.toLowerCase();
      let moves = [];
      if (lower === "p") moves = getPawnMoves(r, c, board, isWhite);
      else if (lower === "r") moves = getRookMoves(r, c, board, isWhite);
      else if (lower === "n") moves = getKnightMoves(r, c, board, isWhite);
      else if (lower === "b") moves = getBishopMoves(r, c, board, isWhite);
      else if (lower === "q") moves = getQueenMoves(r, c, board, isWhite);
      else if (lower === "k") moves = getKingMoves(r, c, board, isWhite);

      for (let [mr, mc] of moves) {
        const copy = board.map(row => [...row]);
        copy[mr][mc] = piece;
        copy[r][c] = null;
        if (!isInCheck(copy, isWhite)) return true;
      }
    }
  }
  return false;
};
