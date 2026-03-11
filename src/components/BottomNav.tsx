import { Gamepad2, Search, User, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  active?: "juegos" | "explorar" | "buscar" | "perfil";
}

const BottomNav = ({ active = "juegos" }: BottomNavProps) => {
  const navigate = useNavigate();

  const items = [
    { id: "juegos" as const, icon: Gamepad2, label: "Juegos", path: "/" },
    { id: "explorar" as const, icon: Compass, label: "Explorar", path: "/explorar" },
    { id: "buscar" as const, icon: Search, label: "Buscar", path: "/explorar" },
    { id: "perfil" as const, icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around py-3 px-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1"
          >
            <item.icon size={22} className={active === item.id ? "text-primary" : "text-muted-foreground"} />
            <span className={`font-body text-[10px] uppercase tracking-wider ${
              active === item.id ? "text-primary" : "text-muted-foreground"
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
