import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Flag, Bomb } from "lucide-react";

const ROWS = 8;
const COLS = 8;
const MINES = 10;

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const generateBoard = (): CellState[][] => {
  const board: CellState[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
  return board;
};

const NUMBER_COLORS: Record<number, string> = {
  1: "text-[hsl(200,100%,60%)]",
  2: "text-[hsl(120,70%,45%)]",
  3: "text-[hsl(0,80%,55%)]",
  4: "text-[hsl(240,80%,60%)]",
  5: "text-[hsl(0,70%,40%)]",
  6: "text-[hsl(180,100%,50%)]",
  7: "text-[hsl(0,0%,70%)]",
  8: "text-[hsl(0,0%,50%)]",
};

const MinesweeperGame = () => {
  const [board, setBoard] = useState<CellState[][]>(generateBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);

  const revealCell = useCallback((r: number, c: number, b: CellState[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (b[r][c].isRevealed || b[r][c].isFlagged) return;
    b[r][c].isRevealed = true;
    if (b[r][c].adjacentMines === 0 && !b[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(r + dr, c + dc, b);
        }
      }
    }
  }, []);

  const checkWin = (b: CellState[][]) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!b[r][c].isMine && !b[r][c].isRevealed) return false;
      }
    }
    return true;
  };

  const chordReveal = useCallback((r: number, c: number, b: CellState[][]) => {
    const cell = b[r][c];
    if (!cell.isRevealed || cell.adjacentMines === 0) return false;

    let flagCount = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].isFlagged) flagCount++;
      }
    }

    if (flagCount !== cell.adjacentMines) return false;

    let hitMine = false;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !b[nr][nc].isRevealed && !b[nr][nc].isFlagged) {
          if (b[nr][nc].isMine) {
            hitMine = true;
          } else {
            revealCell(nr, nc, b);
          }
        }
      }
    }
    return hitMine;
  }, [revealCell]);

  const handleClick = (r: number, c: number) => {
    if (gameOver || won) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (flagMode) {
      if (newBoard[r][c].isRevealed) return;
      newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
      setBoard(newBoard);
      return;
    }

    // Chord: click on revealed number with correct flag count
    if (newBoard[r][c].isRevealed && newBoard[r][c].adjacentMines > 0) {
      const hitMine = chordReveal(r, c, newBoard);
      if (hitMine) {
        newBoard.forEach((row) => row.forEach((cell) => { if (cell.isMine) cell.isRevealed = true; }));
        setBoard(newBoard);
        setGameOver(true);
        return;
      }
      setBoard(newBoard);
      if (checkWin(newBoard)) setWon(true);
      return;
    }

    if (newBoard[r][c].isFlagged) return;

    if (newBoard[r][c].isMine) {
      // Reveal all mines
      newBoard.forEach((row) => row.forEach((cell) => { if (cell.isMine) cell.isRevealed = true; }));
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    revealCell(r, c, newBoard);
    setBoard(newBoard);
    if (checkWin(newBoard)) setWon(true);
  };

  const reset = () => {
    setBoard(generateBoard());
    setGameOver(false);
    setWon(false);
    setFlagMode(false);
  };

  const flagsPlaced = board.flat().filter((c) => c.isFlagged).length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background gap-4 px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border">
          <Bomb size={14} className="text-destructive" />
          <span className="font-display text-sm text-foreground">{MINES - flagsPlaced}</span>
        </div>

        <button onClick={reset} className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary transition-colors">
          <RotateCcw size={14} className="text-muted-foreground" />
        </button>

        <button
          onClick={() => setFlagMode(!flagMode)}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
            flagMode ? "bg-primary/20 border-primary text-primary" : "bg-secondary border-border text-muted-foreground"
          }`}
        >
          <Flag size={14} />
        </button>
      </div>

      {/* Board */}
      <div
        className="grid gap-[2px] p-2 rounded-xl bg-secondary/50 border border-border"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <motion.button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-sm font-display transition-colors ${
                cell.isRevealed
                  ? cell.isMine
                    ? "bg-destructive/30 border border-destructive/50"
                    : "bg-background border border-border/30"
                  : "bg-secondary border border-border hover:border-primary/50"
              }`}
            >
              {cell.isRevealed ? (
                cell.isMine ? (
                  <Bomb size={14} className="text-destructive" />
                ) : cell.adjacentMines > 0 ? (
                  <span className={NUMBER_COLORS[cell.adjacentMines]}>{cell.adjacentMines}</span>
                ) : null
              ) : cell.isFlagged ? (
                <Flag size={12} className="text-primary" />
              ) : null}
            </motion.button>
          ))
        )}
      </div>

      {/* Status */}
      {(gameOver || won) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className={`font-display text-lg ${won ? "text-primary text-glow" : "text-destructive"}`}>
            {won ? "¡GANASTE! 🎉" : "¡BOOM! 💥"}
          </p>
          <button onClick={reset} className="mt-2 font-body text-xs text-muted-foreground underline">
            Jugar de nuevo
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MinesweeperGame;
