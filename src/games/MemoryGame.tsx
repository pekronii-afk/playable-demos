import { useState, useCallback, useEffect } from "react";

const SYMBOLS = ["◆", "●", "▲", "■", "★", "✦", "⬡", "✿"];

const generateCards = () => {
  const pairs = SYMBOLS.slice(0, 6);
  const cards = [...pairs, ...pairs]
    .sort(() => Math.random() - 0.5)
    .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }));
  return cards;
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const handleFlip = useCallback((id: number) => {
    if (selected.length >= 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setSelected((prev) => [...prev, id]);
  }, [cards, selected]);

  useEffect(() => {
    if (selected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = selected;
      const cardA = cards.find((c) => c.id === a)!;
      const cardB = cards.find((c) => c.id === b)!;
      if (cardA.symbol === cardB.symbol) {
        setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
        setMatches((m) => m + 1);
        setSelected([]);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
          setSelected([]);
        }, 600);
      }
    }
  }, [selected, cards]);

  const reset = () => {
    setCards(generateCards());
    setSelected([]);
    setMoves(0);
    setMatches(0);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-background px-6">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex gap-6">
        <span className="font-display text-2xl text-primary">{matches}/6</span>
        <span className="font-body text-sm text-muted-foreground self-end">MOVIMIENTOS: {moves}</span>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <span className="font-body text-sm text-muted-foreground uppercase tracking-widest">
          Encuentra los pares
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-xs mt-8">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-display transition-colors active:scale-95 ${
              card.flipped || card.matched
                ? "bg-primary/20 border border-primary text-primary"
                : "bg-secondary border border-border text-transparent"
            }`}
            onClick={() => handleFlip(card.id)}
          >
            {card.flipped || card.matched ? card.symbol : "?"}
          </button>
        ))}
      </div>

      {matches === 6 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20">
          <span className="font-display text-3xl text-primary mb-2">¡COMPLETADO!</span>
          <span className="font-body text-muted-foreground mb-6">En {moves} movimientos</span>
          <button
            onClick={reset}
            className="font-display text-sm uppercase tracking-widest text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
