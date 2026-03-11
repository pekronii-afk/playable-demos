import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, Brain, Target, Flame } from "lucide-react";
import { GAMES } from "@/data/games";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "todos", label: "Todos", icon: Flame },
  { id: "Arcade", label: "Arcade", icon: Zap },
  { id: "Puzzle", label: "Puzzle", icon: Brain },
  { id: "Reflejos", label: "Reflejos", icon: Target },
];

const TRENDING = [
  { title: "NEON SNAKE", plays: "890K", trend: "+24%" },
  { title: "TAP TARGET", plays: "340K", trend: "+18%" },
  { title: "REACCIÓN", plays: "150K", trend: "+45%" },
];

const Explore = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const navigate = useNavigate();

  const filteredGames = GAMES.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.developer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto bg-background hide-scrollbar">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl text-foreground text-glow mb-4">Explorar</h1>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar juegos..."
            className="w-full bg-secondary border border-border rounded-xl pl-11 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground"
              }`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trending */}
      {!search && selectedCategory === "todos" && (
        <div className="px-5 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="font-display text-sm text-foreground uppercase tracking-wider">Trending</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            {TRENDING.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[160px] p-4 rounded-xl bg-gradient-to-br from-primary/10 via-secondary to-secondary border border-primary/20"
              >
                <span className="font-display text-xs text-primary">{item.trend}</span>
                <h3 className="font-display text-sm text-foreground mt-1">{item.title}</h3>
                <span className="font-body text-xs text-muted-foreground">{item.plays} jugadas</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Games grid */}
      <div className="px-5 pb-24">
        <h2 className="font-display text-sm text-foreground uppercase tracking-wider mb-3">
          {selectedCategory === "todos" ? "Todos los juegos" : selectedCategory}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredGames.map((game, i) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate("/")}
              className="relative overflow-hidden rounded-xl border border-border bg-secondary/50 p-4 text-left hover:border-primary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Zap size={18} className="text-primary" />
              </div>
              <h3 className="font-display text-xs text-foreground mb-1">{game.title}</h3>
              <p className="font-body text-[10px] text-muted-foreground">@{game.developer}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-body text-[10px] text-primary uppercase tracking-wider">{game.category}</span>
                <span className="font-body text-[10px] text-muted-foreground">{game.downloads}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search size={32} className="mb-3 opacity-50" />
            <p className="font-body text-sm">No se encontraron juegos</p>
          </div>
        )}
      </div>

      <BottomNav active="explorar" />
    </div>
  );
};

export default Explore;
