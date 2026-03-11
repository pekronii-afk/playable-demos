import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Edit3, X, Check, MapPin, LinkIcon, Calendar, Gamepad2, Heart, Trophy } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  bannerUrl: string;
  avatarUrl: string;
  gamesPlayed: number;
  totalLikes: number;
  highScores: number;
}

const DEFAULT_PROFILE: ProfileData = {
  username: "jugador_pro",
  displayName: "Jugador Pro",
  bio: "Amante de los minijuegos 🎮 | Siempre buscando el high score",
  location: "Ciudad de México",
  website: "",
  joinDate: "Marzo 2026",
  bannerUrl: "",
  avatarUrl: "",
  gamesPlayed: 127,
  totalLikes: 3400,
  highScores: 42,
};

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("user-profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"favoritos" | "recientes" | "logros">("favoritos");

  useEffect(() => {
    localStorage.setItem("user-profile", JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setProfile(editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setEditing(false);
  };

  const handleImageUpload = (type: "banner" | "avatar") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setEditData((prev) => ({
        ...prev,
        [type === "banner" ? "bannerUrl" : "avatarUrl"]: url,
      }));
    };
    reader.readAsDataURL(file);
  };

  const stats = [
    { icon: Gamepad2, label: "Jugados", value: profile.gamesPlayed },
    { icon: Heart, label: "+1 dados", value: profile.totalLikes.toLocaleString() },
    { icon: Trophy, label: "High Scores", value: profile.highScores },
  ];

  const favoriteGames = [
    { title: "NEON SNAKE", category: "Arcade", score: "890K" },
    { title: "TAP TARGET", category: "Arcade", score: "12.4K" },
    { title: "MEMORY MATCH", category: "Puzzle", score: "8.9K" },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto bg-background hide-scrollbar">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        {(editing ? editData.bannerUrl : profile.bannerUrl) ? (
          <img
            src={editing ? editData.bannerUrl : profile.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {editing && (
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary/80 backdrop-blur-sm flex items-center justify-center border border-border"
          >
            <Camera size={16} className="text-foreground" />
          </button>
        )}
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload("banner")} />
      </div>

      {/* Avatar + Edit button */}
      <div className="relative px-5 -mt-16">
        <div className="flex items-end justify-between">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-background overflow-hidden bg-secondary">
              {(editing ? editData.avatarUrl : profile.avatarUrl) ? (
                <img
                  src={editing ? editData.avatarUrl : profile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
                  <span className="font-display text-3xl text-primary text-glow">
                    {(editing ? editData.displayName : profile.displayName).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {editing && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Camera size={14} className="text-primary-foreground" />
              </button>
            )}
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload("avatar")} />
          </div>

          {!editing ? (
            <button
              onClick={() => { setEditData(profile); setEditing(true); }}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-primary text-primary font-body text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors"
            >
              <Edit3 size={14} />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleSave}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
              >
                <Check size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="px-5 mt-4 pb-4">
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <input
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 font-display text-lg text-foreground focus:outline-none focus:border-primary"
                placeholder="Nombre"
              />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-body text-sm">@</span>
                <input
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="username"
                />
              </div>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={3}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 font-body text-sm text-foreground resize-none focus:outline-none focus:border-primary"
                placeholder="Biografía"
              />
              <input
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder="Ubicación"
              />
              <input
                value={editData.website}
                onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder="Sitio web"
              />
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-display text-xl text-foreground">{profile.displayName}</h1>
              <p className="font-body text-sm text-muted-foreground">@{profile.username}</p>
              {profile.bio && (
                <p className="font-body text-sm text-foreground/90 mt-3 leading-relaxed">{profile.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1 font-body text-xs">
                    <MapPin size={12} /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <span className="flex items-center gap-1 font-body text-xs text-primary">
                    <LinkIcon size={12} /> {profile.website}
                  </span>
                )}
                <span className="flex items-center gap-1 font-body text-xs">
                  <Calendar size={12} /> {profile.joinDate}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 border-t border-border">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-secondary/50 border border-border/50">
              <stat.icon size={18} className="text-primary" />
              <span className="font-display text-lg text-foreground">{stat.value}</span>
              <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 border-t border-border">
        <div className="flex">
          {(["favoritos", "recientes", "logros"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-body text-xs uppercase tracking-wider transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  style={{ boxShadow: "var(--cyan-glow)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 py-4 pb-24">
        {activeTab === "favoritos" && (
          <div className="space-y-3">
            {favoriteGames.map((g) => (
              <div key={g.title} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
                <div>
                  <h4 className="font-display text-sm text-foreground">{g.title}</h4>
                  <span className="font-body text-xs text-primary uppercase tracking-wider">{g.category}</span>
                </div>
                <span className="font-display text-sm text-muted-foreground">{g.score}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "recientes" && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Gamepad2 size={32} className="mb-3 opacity-50" />
            <p className="font-body text-sm">Juega más para ver tu historial</p>
          </div>
        )}
        {activeTab === "logros" && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: "🏆", name: "Primer juego" },
              { emoji: "🔥", name: "Racha de 5" },
              { emoji: "⚡", name: "Reflejos" },
              { emoji: "🧠", name: "Memoria" },
              { emoji: "🐍", name: "Snake 100" },
              { emoji: "🎯", name: "Puntería" },
            ].map((achievement) => (
              <div key={achievement.name} className="flex flex-col items-center gap-2 py-4 rounded-xl bg-secondary/50 border border-border/50">
                <span className="text-2xl">{achievement.emoji}</span>
                <span className="font-body text-[10px] text-muted-foreground text-center uppercase tracking-wider">{achievement.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="perfil" />
    </div>
  );
};

export default Profile;
