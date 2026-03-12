import { useState, useRef, useCallback } from "react";

type GameState = "waiting" | "ready" | "go" | "result" | "early";

const ReactionGame = () => {
  const [state, setState] = useState<GameState>("waiting");
  const [time, setTime] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const timerRef = useRef<number>(0);
  const startRef = useRef(0);

  const startRound = useCallback(() => {
    setState("ready");
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = window.setTimeout(() => {
      startRef.current = Date.now();
      setState("go");
    }, delay);
  }, []);

  const handleTap = useCallback(() => {
    if (state === "waiting" || state === "result" || state === "early") {
      startRound();
    } else if (state === "ready") {
      clearTimeout(timerRef.current);
      setState("early");
    } else if (state === "go") {
      const ms = Date.now() - startRef.current;
      setTime(ms);
      if (!best || ms < best) setBest(ms);
      setState("result");
    }
  }, [state, best, startRound]);

  const bgColor = state === "go" ? "bg-primary/20" : state === "early" ? "bg-destructive/10" : "bg-background";

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center ${bgColor} transition-colors cursor-pointer`}
      onClick={handleTap}
    >
      {state === "waiting" && (
        <div className="text-center">
          <p className="font-display text-2xl text-primary mb-2">REACCIÓN</p>
          <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">Toca para empezar</p>
        </div>
      )}

      {state === "ready" && (
        <div className="text-center">
          <p className="font-display text-2xl text-muted-foreground mb-2">ESPERA...</p>
          <p className="font-body text-sm text-muted-foreground">No toques aún</p>
        </div>
      )}

      {state === "go" && (
        <div className="text-center">
          <p className="font-display text-5xl text-primary mb-2">¡YA!</p>
          <p className="font-body text-sm text-primary uppercase tracking-widest">¡Toca ahora!</p>
        </div>
      )}

      {state === "result" && (
        <div className="text-center">
          <p className="font-display text-5xl text-primary mb-1">{time}ms</p>
          {best && <p className="font-body text-sm text-muted-foreground">Mejor: {best}ms</p>}
          <p className="font-body text-xs text-muted-foreground mt-4 uppercase tracking-widest">Toca para reintentar</p>
        </div>
      )}

      {state === "early" && (
        <div className="text-center">
          <p className="font-display text-2xl text-destructive mb-2">¡MUY PRONTO!</p>
          <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">Toca para reintentar</p>
        </div>
      )}
    </div>
  );
};

export default ReactionGame;
