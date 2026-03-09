import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Volume2, VolumeX, Share2 } from "lucide-react";
import type { GameInfo } from "@/data/games";

interface GameCardOverlayProps {
  game: GameInfo;
  isActive: boolean;
}

const GameCardOverlay = ({ game, isActive }: GameCardOverlayProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(game.likes);
  const [showInfo, setShowInfo] = useState(false);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number }[]>([]);
  const [muted, setMuted] = useState(true);
  const idRef = useRef(0);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      const id = idRef.current++;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setFloats((f) => [...f, { id, x: rect.width / 2, y: 0 }]);
      setTimeout(() => setFloats((f) => f.filter((fl) => fl.id !== id)), 800);
    }
  }, [liked]);

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <>
      {/* Right side actions */}
      <div className="absolute right-4 bottom-36 z-20 flex flex-col items-center gap-6">
        {/* +1 Button */}
        <button onClick={handleLike} className="relative flex flex-col items-center gap-1">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
            liked ? "border-primary bg-primary/20 text-primary" : "border-border bg-secondary/80 text-foreground"
          }`}>
            <span className="font-display text-sm">+1</span>
          </div>
          <span className="font-body text-xs text-muted-foreground">{formatNumber(likeCount)}</span>
          <AnimatePresence>
            {floats.map((f) => (
              <motion.span
                key={f.id}
                className="absolute font-display text-lg text-primary text-glow pointer-events-none"
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                +1
              </motion.span>
            ))}
          </AnimatePresence>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border border-border bg-secondary/80">
            <Share2 size={18} className="text-foreground" />
          </div>
          <span className="font-body text-xs text-muted-foreground">Compartir</span>
        </button>

        {/* Sound toggle */}
        <button onClick={() => setMuted(!muted)} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border border-border bg-secondary/80">
            {muted ? <VolumeX size={18} className="text-foreground" /> : <Volume2 size={18} className="text-primary" />}
          </div>
          <span className="font-body text-xs text-muted-foreground">{muted ? "Sonido" : "Activo"}</span>
        </button>
      </div>

      {/* Download button (pulsing circle) */}
      <div className="absolute right-4 bottom-20 z-20">
        <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center pulse-download">
          <Download size={22} className="text-primary-foreground" />
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-20 z-20">
        <button onClick={() => setShowInfo(!showInfo)} className="text-left">
          <h3 className="font-display text-lg text-foreground mb-1">{game.title}</h3>
          <p className="font-body text-sm text-muted-foreground">@{game.developer}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-body text-xs text-primary uppercase tracking-wider">{game.category}</span>
            <span className="font-body text-xs text-muted-foreground">{game.downloads} descargas</span>
          </div>
        </button>
      </div>

      {/* Info panel (swipe left) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "30%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-30 bg-background/95 backdrop-blur-sm flex flex-col justify-center px-8"
            onClick={() => setShowInfo(false)}
          >
            <h2 className="font-display text-2xl text-primary text-glow mb-4">{game.title}</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{game.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-xs text-muted-foreground uppercase">{game.category}</span>
              <span className="text-border">•</span>
              <span className="font-body text-xs text-muted-foreground">{game.downloads} descargas</span>
              <span className="text-border">•</span>
              <span className="font-body text-xs text-muted-foreground">{formatNumber(likeCount)} +1s</span>
            </div>
            <button className="self-start font-display text-sm uppercase tracking-widest text-primary-foreground bg-primary px-8 py-3 rounded-lg">
              DESCARGAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameCardOverlay;
