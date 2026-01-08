import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, Project } from "@/services/mockApi";
import { cn } from "@/lib/utils";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('1');
  const [activeStage, setActiveStage] = useState<number>(1);
  
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const allTags = ['all', ...Array.from(new Set(projects.flatMap(p => p.tags)))];
  const filteredProjects = selectedTag === 'all' 
    ? projects 
    : projects.filter(p => p.tags.includes(selectedTag));

  const currentProject = projects.find(p => p.id === selectedProject);
  const currentStage = currentProject?.stages.find(stage => stage.id === activeStage);

  if (loading) {
    return (
      <section className="py-20">
        <div className="h-8 bg-purple-translucent rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-12 gap-6 h-96">
          <div className="col-span-3 bg-purple-translucent rounded animate-pulse"></div>
          <div className="col-span-6 bg-purple-translucent rounded animate-pulse"></div>
          <div className="col-span-3 bg-purple-translucent rounded animate-pulse"></div>
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
            "transition-all duration-700 transform",
            headerInView ? "animate-fade-in" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">Empresa</h2>
          <p className="text-text-secondary text-lg mb-8">
            Detalles de la Empresa
          </p>
        </div>

        {/* Three Panel Layout */}
        <div 
          ref={contentRef}
          className={cn(
            "grid grid-cols-12 gap-6 min-h-[500px] transition-all duration-700 transform",
            contentInView ? "animate-scale-in" : "opacity-0 scale-95"
          )}
        >
          {/* Projects Panel (Left) */}
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Alineamientos</h3>
              {filteredProjects.map((project, index) => (
                <div key={project.id}>
                  <button
                    onClick={() => {
                      setSelectedProject(project.id);
                      setActiveStage(1);
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-smooth relative",
                      selectedProject === project.id
                        ? "bg-purple text-white border-cyan shadow-subtle"
                        : "bg-surface text-text-secondary border-purple-border hover:text-text-primary hover:bg-purple/5 hover:border-cyan/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
                        selectedProject === project.id 
                          ? "bg-cyan text-background border-cyan" 
                          : "bg-purple-translucent border-purple-border"
                      )}>
                        {project.id}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{project.title}</h4>
                      </div>
                    </div>
                  </button>

                  {/* Stages (Expandable when project is selected) */}
                  {selectedProject === project.id && (
                    <div className="ml-6 mt-2 space-y-2">
                      {project.stages.map((stage, stageIndex) => (
                        <button
                          key={stage.id}
                          onClick={() => setActiveStage(stage.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-smooth text-xs",
                            activeStage === stage.id
                              ? "bg-cyan/20 text-cyan border-cyan"
                              : "bg-surface/50 text-text-secondary border-purple-border/50 hover:text-text-primary hover:bg-purple/5"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border",
                              activeStage === stage.id
                                ? "bg-cyan text-white border-cyan"
                                : "bg-purple-translucent border-purple-border"
                            )}>
                              {project.id}.{stageIndex + 1}
                            </div>
                            <span className="font-medium">{stage.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Connection line between projects */}
                  {index < filteredProjects.length - 1 && (
                    <div className="ml-8 w-0.5 h-6 bg-purple-border my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Viewer Panel (Right) */}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-surface border border-purple-border rounded-xl p-6 h-full">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {currentStage?.title}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-2">Proyecto</h4>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {currentProject?.description} /* colocar stages.summary */
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;