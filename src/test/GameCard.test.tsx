import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameCard from '../components/GameCard'

describe('GameCard', () => {
  it('muestra el nombre del juego', () => {
    render(<GameCard title="Minesweeper" onPlay={() => {}} />)
    expect(screen.getByText('Minesweeper')).toBeInTheDocument()
  })

  it('llama onPlay al hacer click', () => {
    const onPlay = vi.fn()
    render(<GameCard title="Minesweeper" onPlay={onPlay} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it('muestra imagen del juego si se pasa', () => {
    render(<GameCard title="Minesweeper" image="/minesweeper.png" onPlay={() => {}} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/minesweeper.png')
  })
})
