import { Gamepad2, Search, User, Compass } from "lucide-react";

const BottomNav = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around py-3 px-4">
        <button className="flex flex-col items-center gap-1">
          <Gamepad2 size={22} className="text-primary" />
          <span className="font-body text-[10px] text-primary uppercase tracking-wider">Juegos</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Compass size={22} className="text-muted-foreground" />
          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Explorar</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Search size={22} className="text-muted-foreground" />
          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Buscar</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <User size={22} className="text-muted-foreground" />
          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
