import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, TeamMember } from "@/services/mockApi";
import { cn } from "@/lib/utils";

const Team = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [gridRef, gridInView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await api.getTeam();
        setTeam(data);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="space-y-8">
          <div className="h-8 bg-purple-translucent rounded animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface border border-purple-border rounded-xl p-6 space-y-4">
                <div className="w-20 h-20 bg-purple-translucent rounded-full animate-pulse mx-auto"></div>
                <div className="h-6 bg-purple-translucent rounded animate-pulse"></div>
                <div className="h-4 bg-purple-translucent rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="space-y-8">
        <div 
          ref={headerRef}
          className={cn(
            "text-left transition-all duration-700 transform",
            headerInView ? "animate-fade-in" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">Nuestro Equipo</h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl">
            Conoce a los "profesionales" que hicieron posible este proyecto.
          </p>
        </div>

        {/* Team Grid */}
        <div 
          ref={gridRef}
          className={cn(
            "grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 transform",
            gridInView ? "animate-fade-in" : "opacity-0 translate-y-8"
          )}
        >
          {team.map((member, index) => (
            <div 
              key={index}
              className={cn(
                "group bg-surface border border-purple-border rounded-xl p-6 hover:shadow-elevated transition-all duration-500 hover:border-cyan/30 transform hover:-translate-y-2 hover:scale-105 relative cursor-pointer",
                gridInView ? "animate-scale-in" : "opacity-0 scale-95"
              )}
              style={{
                transform: `rotate(${index % 2 === 0 ? 1 : -1}deg)`,
                animationDelay: `${index * 100}ms`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${index % 2 === 0 ? 1 : -1}deg) translateY(0) scale(1)`;
              }}
            >
              {/* Gradient background overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

              {/* Animated particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-xl">
                <div className="absolute w-1 h-1 bg-cyan rounded-full animate-ping" style={{ top: '20%', left: '15%', animationDuration: '2s' }} />
                <div className="absolute w-1 h-1 bg-purple rounded-full animate-ping" style={{ top: '60%', right: '20%', animationDuration: '2.5s', animationDelay: '0.3s' }} />
                <div className="absolute w-1 h-1 bg-cyan rounded-full animate-ping" style={{ bottom: '25%', left: '25%', animationDuration: '2.2s', animationDelay: '0.5s' }} />
              </div>

              {/* Avatar */}
              <div className="relative mb-4 z-10">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-purple-border group-hover:border-cyan transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-cyan/50">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Online indicator with pulse animation */}
                <div className="absolute bottom-1 right-1/2 transform translate-x-6 w-4 h-4 bg-cyan border-2 border-surface rounded-full animate-pulse" />
              </div>

              {/* Member Info */}
              <div className="text-center space-y-3 relative z-10">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-cyan transition-all duration-300 group-hover:scale-105">
                  {member.name}
                </h3>
                
                <p className="text-sm text-text-secondary font-medium group-hover:text-cyan/80 transition-colors duration-300">
                  {member.role}
                </p>

                {/* Skills - Mostrar TODAS sin límite */}
                <div className="flex flex-wrap gap-1 justify-center min-h-[60px] items-center">
                  {member.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skill}
                      variant="secondary" 
                      className="text-text-secondary border-purple-border text-xs px-2 py-1 "
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-2 justify-center pt-2">
                  {member.links.github && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-9 h-9 p-0 border-purple-border bg-purple-translucent hover:bg-purple/10 hover:border-cyan/50 transition-all duration-300 hover:scale-110 hover:rotate-12"
                      onClick={() => window.open(member.links.github, '_blank')}
                      title="GitHub"
                    >
                      <Github className="w-4 h-4 group-hover:text-cyan transition-colors" />
                    </Button>
                  )}
                  {member.links.mail && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-9 h-9 p-0 border-purple-border bg-purple-translucent hover:bg-purple/10 hover:border-cyan/50 transition-all duration-300 hover:scale-110 hover:-rotate-12"
                      onClick={() => window.open(member.links.mail, '_blank')}
                      title="Mail"
                    >
                      <Mail className="w-4 h-4 group-hover:text-cyan transition-colors" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan transform rotate-45" />
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple via-cyan to-purple transition-all duration-700 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;