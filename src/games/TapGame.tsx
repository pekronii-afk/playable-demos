import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingScore {
  id: number;
  x: number;
  y: number;
}

const TapGame = () => {
  const [score, setScore] = useState(0);
  const [floats, setFloats] = useState<FloatingScore[]>([]);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const idRef = useRef(0);

  const moveTarget = useCallback(() => {
    setTargetPos({
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    });
  }, []);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setScore((s) => s + 1);
    const id = idRef.current++;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    setFloats((f) => [...f, { id, x: clientX - rect.left, y: clientY - rect.top }]);
    setTimeout(() => setFloats((f) => f.filter((fl) => fl.id !== id)), 800);
    moveTarget();
  }, [moveTarget]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Score */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-4xl text-primary text-glow">{score}</span>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <span className="font-body text-sm text-muted-foreground uppercase tracking-widest">
          Toca el objetivo
        </span>
      </div>

      {/* Target */}
      <motion.div
        className="absolute z-10 cursor-pointer"
        style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
        animate={{ scale: [0.8, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        onMouseDown={handleTap}
        onTouchStart={handleTap}
      >
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-primary/10 active:bg-primary/30 transition-colors">
          <div className="w-6 h-6 rounded-full bg-primary" />
        </div>
      </motion.div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-primary" style={{ top: `${(i + 1) * 12.5}%` }} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-primary" style={{ left: `${(i + 1) * 16.6}%` }} />
        ))}
      </div>

      {/* Floating +1 */}
      <AnimatePresence>
        {floats.map((f) => (
          <motion.span
            key={f.id}
            className="absolute font-display text-2xl text-primary text-glow pointer-events-none z-20"
            style={{ left: f.x, top: f.y }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            +1
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TapGame;
