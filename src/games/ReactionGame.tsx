import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      className={`relative w-full h-full flex flex-col items-center justify-center ${bgColor} transition-colors duration-150 cursor-pointer`}
      onClick={handleTap}
    >
      <AnimatePresence mode="wait">
        {state === "waiting" && (
          <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-2xl text-primary text-glow mb-2">REACCIÓN</p>
            <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">Toca para empezar</p>
          </motion.div>
        )}

        {state === "ready" && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-2xl text-muted-foreground mb-2">ESPERA...</p>
            <p className="font-body text-sm text-muted-foreground">No toques aún</p>
          </motion.div>
        )}

        {state === "go" && (
          <motion.div key="go" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-5xl text-primary text-glow-strong mb-2">¡YA!</p>
            <p className="font-body text-sm text-primary uppercase tracking-widest">¡Toca ahora!</p>
          </motion.div>
        )}

        {state === "result" && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-5xl text-primary text-glow-strong mb-1">{time}ms</p>
            {best && <p className="font-body text-sm text-muted-foreground">Mejor: {best}ms</p>}
            <p className="font-body text-xs text-muted-foreground mt-4 uppercase tracking-widest">Toca para reintentar</p>
          </motion.div>
        )}

        {state === "early" && (
          <motion.div key="early" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-2xl text-destructive mb-2">¡MUY PRONTO!</p>
            <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">Toca para reintentar</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative ring */}
      {state === "go" && (
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-primary"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

export default ReactionGame;
