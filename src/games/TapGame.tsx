import { useState, useCallback, useRef } from "react";

const TapGame = () => {
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });

  const moveTarget = useCallback(() => {
    setTargetPos({
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    });
  }, []);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setScore((s) => s + 1);
    moveTarget();
  }, [moveTarget]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="font-display text-4xl text-primary">{score}</span>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <span className="font-body text-sm text-muted-foreground uppercase tracking-widest">
          Toca el objetivo
        </span>
      </div>

      <div
        className="absolute z-10 cursor-pointer"
        style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
        onMouseDown={handleTap}
        onTouchStart={handleTap}
      >
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-primary/10 active:bg-primary/30 transition-colors">
          <div className="w-6 h-6 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
};

export default TapGame;
