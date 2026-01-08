import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Eye, FileText, Youtube } from "lucide-react";
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

  // Helper function to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to convert Google Drive URL to preview URL
  const getDrivePreviewUrl = (url: string) => {
    // Extract file ID from various Google Drive URL formats
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

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
          <h2 className="text-4xl font-bold text-text-primary mb-4">Proyectos</h2>
          <p className="text-text-secondary text-lg mb-8">
            Explora nuestros proyectos más destacados y las tecnologías implementadas.
          </p>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-smooth border",
                  selectedTag === tag
                    ? "bg-purple text-white border-cyan"
                    : "bg-purple-translucent text-text-secondary border-purple-border hover:text-text-primary hover:bg-purple/10"
                )}
              >
                {tag === 'all' ? 'Todos' : tag}
              </button>
            ))}
          </div>
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
          <div className="col-span-12 md:col-span-3">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Proyectos y sus etapas</h3>
              {filteredProjects.map((project) => (
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
                    <div className="ml-6 mt-2 space-y-0 relative">
                      {/* Vertical connection line for stages */}
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-purple-border"></div>
                      
                      {project.stages.map((stage, stageIndex) => (
                        <div key={stage.id} className="relative">
                          <button
                            onClick={() => setActiveStage(stage.id)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-smooth text-xs relative z-10 my-2",
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Viewer Panel (Center) */}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-surface border border-purple-border rounded-xl p-6 h-full">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {currentStage?.title}
              </h3>
              
              <div className="bg-background border border-purple-border/60 rounded-lg mb-4 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto space-y-4 p-4 pr-3">
                  {currentStage?.media?.length ? (
                    currentStage.media.map((item, index) => (
                      <div
                        key={`${item.src}-${index}`}
                        className="relative rounded-lg border border-purple-border/60 bg-surface/40 overflow-hidden"
                      >
                        {item.type === 'youtube' ? (
                          <div className="aspect-video w-full">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${getYouTubeId(item.src)}`}
                              title={item.alt ?? `${currentStage?.title} - video ${index + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-lg"
                            ></iframe>
                          </div>
                        ) : item.type === 'pdf' ? (
                          <div className="w-full">
                            <iframe
                              src={getDrivePreviewUrl(item.src)}
                              width="100%"
                              height="600"
                              frameBorder="0"
                              className="rounded-t-lg"
                              title={item.alt ?? `${currentStage?.title} - documento ${index + 1}`}
                            ></iframe>
                            <div className="bg-surface/80 backdrop-blur-sm p-3 rounded-b-lg border-t border-purple-border/60 flex justify-end">
                              <Button 
                                size="sm" 
                                className="bg-cyan text-white hover:bg-cyan/80 shadow-md"
                                onClick={() => window.open(item.src, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Abrir en nueva pestaña
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={item.alt ?? `${currentStage?.title} - recurso ${index + 1}`}
                            className="w-full max-h-64 object-contain bg-background transition-smooth hover:scale-105"
                          />
                        )}

                        {item.type === 'youtube' && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Youtube className="w-3 h-3" />
                            YouTube
                          </div>
                        )}
                        {item.type === 'pdf' && (
                          <div className="absolute top-2 right-2 bg-purple text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            PDF
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="h-48 flex items-center justify-center text-sm text-text-secondary">
                      Sin material visual disponible por ahora.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Panel (Right) */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-surface border border-purple-border rounded-xl p-6 h-full">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Detalles</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-2">Proyecto</h4>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {currentProject?.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-border">
                  <h4 className="text-sm font-medium text-text-primary mb-2">Etapa actual</h4>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {currentStage?.summary}
                  </p>
                </div>

                {/* Links */}
                {currentStage?.links && currentStage.links.length > 0 && (
                  <div className="pt-3 border-t border-purple-border">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Enlaces:</h4>
                    <div className="space-y-2">
                      {currentStage.links.map((link, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="w-full justify-start border-purple-border bg-purple-translucent hover:bg-purple/10 text-xs"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          {link.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Links */}
                {currentProject && (
                  <div className="pt-3 border-t border-purple-border">
                    <Button 
                      size="sm" 
                      className="w-full bg-cyan text-white hover:bg-cyan/80 shadow-md"
                      onClick={() => window.open(currentProject.links.repo, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Repositorio
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;