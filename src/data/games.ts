export interface GameInfo {
  id: string;
  title: string;
  developer: string;
  category: string;
  likes: number;
  downloads: string;
  description: string;
}

export const GAMES: GameInfo[] = [
  {
    id: "tap-target",
    title: "TAP TARGET",
    developer: "Neon Studios",
    category: "Arcade",
    likes: 12400,
    downloads: "340K",
    description: "Toca los objetivos lo más rápido que puedas. Cuanto más rápido, más puntos. ¿Puedes superar tu récord?",
  },
  {
    id: "memory-match",
    title: "MEMORY MATCH",
    developer: "Pixel Mind Co.",
    category: "Puzzle",
    likes: 8900,
    downloads: "210K",
    description: "Encuentra todos los pares en el menor número de movimientos. Un clásico reinventado con estilo minimalista.",
  },
  {
    id: "snake-neon",
    title: "NEON SNAKE",
    developer: "Retro Byte",
    category: "Arcade",
    likes: 23100,
    downloads: "890K",
    description: "La serpiente clásica con un toque neón. Desliza para controlar y come para crecer. Simple, adictivo, eterno.",
  },
  {
    id: "reaction-test",
    title: "REACCIÓN",
    developer: "Synapse Games",
    category: "Reflejos",
    likes: 6700,
    downloads: "150K",
    description: "¿Qué tan rápidos son tus reflejos? Espera la señal y toca lo más rápido posible. Compite contra ti mismo.",
  },
  {
    id: "minesweeper",
    title: "BUSCAMINAS",
    developer: "Logic Forge",
    category: "Puzzle",
    likes: 15200,
    downloads: "520K",
    description: "El clásico buscaminas reinventado. Descubre todas las casillas sin pisar una mina. Usa banderas para marcar peligros.",
  },
];
