import { useState, useEffect } from "react";
import { Folder, GitBranch, Users, Workflow, Menu, X, ArrowUp, House } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadialMenuProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  showGoUp: boolean;
  onGoUp: () => void;
  processStep?: number;
  onProcessStepChange?: (step: number) => void;
}

const menuItems = [
  { id: 'home', label: 'Inicio', icon: House },
  { id: 'projects', label: 'Proyectos', icon: Folder },
  { id: 'team', label: 'Equipo', icon: Users },
  { id: 'about', label: 'Empresa', icon: Workflow },
];

const RadialMenu = ({
  activeSection,
  onNavigate,
  showGoUp,
  onGoUp,
  processStep = 1,
  onProcessStepChange,
}: RadialMenuProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        {/* Mobile FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-6 left-6 z-50 w-12 h-12 bg-purple border border-purple-border rounded-full flex items-center justify-center text-white hover:bg-purple/90 transition-smooth shadow-elevated focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Side Panel */}
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <div
              className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-purple-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-16 space-y-4">
                {showGoUp && (
                  <button
                    onClick={() => {
                      onGoUp();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-smooth bg-cyan text-white hover:bg-cyan/90 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Ir arriba"
                  >
                    <ArrowUp className="w-5 h-5" />
                    Ir arriba
                  </button>
                )}

                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background",
                      activeSection === item.id
                        ? "bg-purple text-white border border-cyan"
                        : "text-text-secondary hover:text-text-primary hover:bg-purple-translucent"
                    )}
                    aria-label={`Navegar a ${item.label}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Ajuste vertical semicircular
  const radius = 110; // un semicirculo
  const startAngle = -0; // desde arriba
  const endAngle = 180; // hacia abajo
  const angleStep = (endAngle - startAngle) / (menuItems.length - 1);
  const menuOffsetX = 100; // espacio entre el menu y el margen izquierdo

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 flex items-center justify-start w-1/4 z-30">
      <div className="relative w-28 h-[calc(100%)]">
        {menuItems.map((item, index) => {
          const angle = startAngle + index * angleStep;
          const rad = (angle * Math.PI) / 180;
          const x = Math.sin(rad) * radius + menuOffsetX;
          const y = -Math.cos(rad) * radius;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "absolute w-20 h-20 rounded-full flex flex-col items-center justify-center text-xs transition-smooth transform -translate-x-1/2 -translate-y-1/2 border hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background motion-reduce:hover:scale-100",
                activeSection === item.id
                  ? "bg-purple text-white border-cyan shadow-elevated scale-110"
                  : "bg-surface text-text-secondary border-purple-border hover:text-text-primary hover:bg-purple-translucent hover:border-cyan/50"
              )}
              style={{
                left: `${x}px`,
                top: `calc(50% + ${y}px)`,
              }}
              aria-label={`Navegar a ${item.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNavigate(item.id);
                }
              }}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-medium leading-tight px-1">{item.label}</span>
            </button>
          );
        })}

        {showGoUp && (
          <button
            onClick={onGoUp}
            className={cn(
              "absolute left-1/2 top-1/2 w-12 h-12 bg-cyan text-white border-2 border-cyan rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-smooth hover:scale-110 hover:bg-cyan/90 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background shadow-elevated motion-reduce:hover:scale-100"
            )}
            aria-label="Ir arriba"
            title="Ir arriba"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onGoUp();
              }
            }}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
        {/* Central hub when not showing go up */}
          {!showGoUp && (
            <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-purple-translucent border-2 border-purple-border rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple rounded-full" />
            </div>
          )}
      </div>
    </div>
  );
};

export default RadialMenu;

