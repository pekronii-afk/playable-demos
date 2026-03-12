import { useState, useRef, useCallback, useEffect } from "react";
import { GAMES } from "@/data/games";
import GameCardOverlay from "@/components/GameCardOverlay";
import TapGame from "@/games/TapGame";
import MemoryGame from "@/games/MemoryGame";
import SnakeGame from "@/games/SnakeGame";
import ReactionGame from "@/games/ReactionGame";
import MinesweeperGame from "@/games/MinesweeperGame";
import BottomNav from "@/components/BottomNav";

const gameComponents: Record<string, React.FC> = {
  "tap-target": TapGame,
  "memory-match": MemoryGame,
  "snake-neon": SnakeGame,
  "reaction-test": ReactionGame,
  "minesweeper": MinesweeperGame,
};

const GameFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const newIndex = Math.round(el.scrollTop / el.clientHeight);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background">
      <div
        ref={containerRef}
        className="w-full h-full snap-mandatory-y overflow-y-scroll hide-scrollbar"
      >
        {GAMES.map((game, index) => {
          const GameComponent = gameComponents[game.id];
          return (
            <div key={game.id} className="relative w-full h-[100dvh] snap-start">
              {GameComponent && <GameComponent />}
              <GameCardOverlay game={game} isActive={index === activeIndex} />
            </div>
          );
        })}
      </div>
      <BottomNav active="juegos" />
    </div>
  );
};

export default GameFeed;
