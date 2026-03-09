import { useState, useEffect, useCallback, useRef } from "react";

const GRID = 15;
const CELL = 100 / GRID;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const SnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Point>({ x: 3, y: 3 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const dirRef = useRef<Dir>("RIGHT");
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const spawnFood = useCallback((s: Point[]): Point => {
    let p: Point;
    do {
      p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (s.some((seg) => seg.x === p.x && seg.y === p.y));
    return p;
  }, []);

  const reset = () => {
    const initial = [{ x: 7, y: 7 }];
    setSnake(initial);
    setFood(spawnFood(initial));
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setGameOver(false);
    setStarted(true);
  };

  const handleTouch = useCallback((e: React.TouchEvent) => {
    if (!started) { reset(); return; }
    const touch = e.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  }, [started]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const end = e.changedTouches[0];
    const dx = end.clientX - touchRef.current.x;
    const dy = end.clientY - touchRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && dirRef.current !== "LEFT") { dirRef.current = "RIGHT"; setDir("RIGHT"); }
      if (dx < -20 && dirRef.current !== "RIGHT") { dirRef.current = "LEFT"; setDir("LEFT"); }
    } else {
      if (dy > 20 && dirRef.current !== "UP") { dirRef.current = "DOWN"; setDir("DOWN"); }
      if (dy < -20 && dirRef.current !== "DOWN") { dirRef.current = "UP"; setDir("UP"); }
    }
    touchRef.current = null;
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const d = dirRef.current;
        if (d === "UP") head.y--;
        if (d === "DOWN") head.y++;
        if (d === "LEFT") head.x--;
        if (d === "RIGHT") head.x++;

        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setGameOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const next = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood(spawnFood(next));
        } else {
          next.pop();
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [started, gameOver, food, spawnFood]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started && !gameOver) { reset(); return; }
      if (gameOver) { reset(); return; }
      if (e.key === "ArrowUp" && dirRef.current !== "DOWN") { dirRef.current = "UP"; setDir("UP"); }
      if (e.key === "ArrowDown" && dirRef.current !== "UP") { dirRef.current = "DOWN"; setDir("DOWN"); }
      if (e.key === "ArrowLeft" && dirRef.current !== "RIGHT") { dirRef.current = "LEFT"; setDir("LEFT"); }
      if (e.key === "ArrowRight" && dirRef.current !== "LEFT") { dirRef.current = "RIGHT"; setDir("RIGHT"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, gameOver]);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center bg-background"
      onTouchStart={handleTouch}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-4xl text-primary text-glow">{Math.max(0, snake.length - 1)}</span>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <span className="font-body text-sm text-muted-foreground uppercase tracking-widest">
          {!started ? "Toca para jugar" : gameOver ? "Toca para reintentar" : "Desliza para mover"}
        </span>
      </div>

      <div className="relative w-[80vw] max-w-[300px] aspect-square border border-border rounded-lg overflow-hidden mt-8">
        {/* Grid */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: GRID - 1 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-primary" style={{ top: `${((i + 1) / GRID) * 100}%` }} />
          ))}
          {Array.from({ length: GRID - 1 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-primary" style={{ left: `${((i + 1) / GRID) * 100}%` }} />
          ))}
        </div>

        {/* Snake */}
        {snake.map((seg, i) => (
          <div
            key={i}
            className={`absolute rounded-sm ${i === 0 ? "bg-primary" : "bg-primary/60"}`}
            style={{
              left: `${seg.x * CELL}%`,
              top: `${seg.y * CELL}%`,
              width: `${CELL}%`,
              height: `${CELL}%`,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-primary rounded-full animate-pulse"
          style={{
            left: `${food.x * CELL + CELL * 0.15}%`,
            top: `${food.y * CELL + CELL * 0.15}%`,
            width: `${CELL * 0.7}%`,
            height: `${CELL * 0.7}%`,
          }}
        />
      </div>

      {(gameOver || !started) && (
        <button
          onClick={reset}
          className="mt-6 font-display text-sm uppercase tracking-widest text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
        >
          {gameOver ? "Reintentar" : "Iniciar"}
        </button>
      )}
    </div>
  );
};

export default SnakeGame;
