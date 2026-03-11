import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GAMES } from "@/data/games";
import GameCardOverlay from "@/components/GameCardOverlay";
import TapGame from "@/games/TapGame";
import MemoryGame from "@/games/MemoryGame";
import SnakeGame from "@/games/SnakeGame";
import ReactionGame from "@/games/ReactionGame";
import BottomNav from "@/components/BottomNav";

const gameComponents: Record<string, React.FC> = {
  "tap-target": TapGame,
  "memory-match": MemoryGame,
  "snake-neon": SnakeGame,
  "reaction-test": ReactionGame,
};

const GameFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const newIndex = Math.round(el.scrollTop / el.clientHeight);
    if (newIndex !== activeIndex) {
      setShowTransition(true);
      setTimeout(() => {
        setActiveIndex(newIndex);
        setShowTransition(false);
      }, 150);
    }
    lastScrollTop.current = el.scrollTop;
  }, [activeIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background">
      {/* Insertion gesture transition */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="h-[2px] bg-primary"
              initial={{ width: 2 }}
              animate={{ width: "100vw" }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ boxShadow: "0 0 30px hsl(180 100% 50% / 0.6)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed */}
      <div
        ref={containerRef}
        className="w-full h-full snap-mandatory-y overflow-y-scroll hide-scrollbar"
      >
        {GAMES.map((game, index) => {
          const GameComponent = gameComponents[game.id];
          return (
            <div
              key={game.id}
              className="relative w-full h-[100dvh] snap-start"
            >
              {GameComponent && <GameComponent />}
              <GameCardOverlay game={game} isActive={index === activeIndex} />
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="juegos" />
    </div>
  );
};

export default GameFeed;
