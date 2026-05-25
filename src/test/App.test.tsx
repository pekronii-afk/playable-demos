import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('Navegación', () => {
  it('muestra la página principal al cargar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/playable demos/i)).toBeInTheDocument()
  })

  it('navega a un juego al seleccionarlo', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Minesweeper'))
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
  })
})
