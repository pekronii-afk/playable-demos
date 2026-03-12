import { useState } from "react";
import { Download, Volume2, VolumeX, Share2 } from "lucide-react";
import type { GameInfo } from "@/data/games";

interface GameCardOverlayProps {
  game: GameInfo;
  isActive: boolean;
}

const GameCardOverlay = ({ game }: GameCardOverlayProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(game.likes);
  const [showInfo, setShowInfo] = useState(false);
  const [muted, setMuted] = useState(true);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <>
      {/* Right side actions */}
      <div className="absolute right-4 bottom-36 z-20 flex flex-col items-center gap-5">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
            liked ? "border-primary bg-primary/20 text-primary" : "border-border bg-secondary/80 text-foreground"
          }`}>
            <span className="font-display text-sm">+1</span>
          </div>
          <span className="font-body text-[10px] text-muted-foreground">{formatNumber(likeCount)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center border border-border bg-secondary/80">
            <Share2 size={16} className="text-foreground" />
          </div>
          <span className="font-body text-[10px] text-muted-foreground">Compartir</span>
        </button>

        <button onClick={() => setMuted(!muted)} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center border border-border bg-secondary/80">
            {muted ? <VolumeX size={16} className="text-foreground" /> : <Volume2 size={16} className="text-primary" />}
          </div>
          <span className="font-body text-[10px] text-muted-foreground">{muted ? "Sonido" : "Activo"}</span>
        </button>
      </div>

      {/* Download button */}
      <div className="absolute right-4 bottom-20 z-20">
        <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Download size={20} className="text-primary-foreground" />
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-20 z-20">
        <button onClick={() => setShowInfo(!showInfo)} className="text-left">
          <h3 className="font-display text-base text-foreground mb-0.5">{game.title}</h3>
          <p className="font-body text-xs text-muted-foreground">@{game.developer}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-body text-[10px] text-primary uppercase tracking-wider">{game.category}</span>
            <span className="font-body text-[10px] text-muted-foreground">{game.downloads} descargas</span>
          </div>
        </button>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div
          className="absolute inset-0 z-30 bg-background/95 flex flex-col justify-center px-8 transition-all"
          onClick={() => setShowInfo(false)}
        >
          <h2 className="font-display text-xl text-primary mb-3">{game.title}</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{game.description}</p>
          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground font-body">
            <span>{game.category}</span>
            <span>•</span>
            <span>{game.downloads} descargas</span>
            <span>•</span>
            <span>{formatNumber(likeCount)} +1s</span>
          </div>
          <button className="self-start font-display text-sm uppercase text-primary-foreground bg-primary px-6 py-2.5 rounded-lg">
            DESCARGAR
          </button>
        </div>
      )}
    </>
  );
};

export default GameCardOverlay;
