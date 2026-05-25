import { describe, it, expect } from 'vitest'
import { createBoard, revealCell, isSolved } from '../games/minesweeper'

describe('Minesweeper', () => {
  it('crea tablero con las dimensiones correctas', () => {
    const board = createBoard(8, 8, 10)
    expect(board.length).toBe(8)
    expect(board[0].length).toBe(8)
  })

  it('coloca el número de minas correcto', () => {
    const board = createBoard(8, 8, 10)
    const mines = board.flat().filter(cell => cell.isMine)
    expect(mines.length).toBe(10)
  })

  it('revelar una celda la marca como visible', () => {
    const board = createBoard(4, 4, 0)
    const updated = revealCell(board, 0, 0)
    expect(updated[0][0].revealed).toBe(true)
  })

  it('detecta tablero resuelto cuando solo quedan minas ocultas', () => {
    const board = createBoard(2, 2, 0)
    const allRevealed = board.map(row =>
      row.map(cell => ({ ...cell, revealed: true }))
    )
    expect(isSolved(allRevealed)).toBe(true)
  })
})
