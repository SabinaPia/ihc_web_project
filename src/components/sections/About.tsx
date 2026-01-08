import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api, CompanySection } from "@/services/mockApi";
import { cn } from "@/lib/utils";

const About = () => {
  const [sections, setSections] = useState<CompanySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('1');
  const [activeItem, setActiveItem] = useState<number>(1);
  
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await api.getCompanySections();
        setSections(data);
      } finally {
        setLoading(false);
      }
    };
    loadSections();
  }, []);

  const currentSection = sections.find(s => s.id === selectedSection);
  const currentItem = currentSection?.items.find(item => item.id === activeItem);

  if (loading) {
    return (
      <section className="py-20">
        <div className="h-8 bg-purple-translucent rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-12 gap-6 h-96">
          <div className="col-span-6 bg-purple-translucent rounded animate-pulse"></div>
          <div className="col-span-6 bg-purple-translucent rounded animate-pulse"></div>
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
          <h2 className="text-4xl font-bold text-text-primary mb-4">Nosotros</h2>
          <p className="text-text-secondary text-lg mb-8">
            Conoce nuestros objetivos, metas y los valores que nos guían.
          </p>
        </div>

        {/* Two Panel Layout */}
        <div 
          ref={contentRef}
          className={cn(
            "grid grid-cols-12 gap-6 min-h-[500px] transition-all duration-700 transform",
            contentInView ? "animate-scale-in" : "opacity-0 scale-95"
          )}
        >
          {/* Sections Panel (Left) */}
          <div className="col-span-12 md:col-span-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Alineamientos</h3>
              {sections.map((section, index) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setSelectedSection(section.id);
                      setActiveItem(1);
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-smooth relative",
                      selectedSection === section.id
                        ? "bg-purple text-white border-cyan shadow-subtle"
                        : "bg-surface text-text-secondary border-purple-border hover:text-text-primary hover:bg-purple/5 hover:border-cyan/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
                        selectedSection === section.id 
                          ? "bg-cyan text-background border-cyan" 
                          : "bg-purple-translucent border-purple-border"
                      )}>
                        {section.id}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{section.title}</h4>
                      </div>
                    </div>
                  </button>

                  {/* Items (Expandable when section is selected) */}
                  {selectedSection === section.id && (
                    <div className="ml-6 mt-2 space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveItem(item.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-smooth text-xs",
                            activeItem === item.id
                              ? "bg-cyan/20 text-cyan border-cyan"
                              : "bg-surface/50 text-text-secondary border-purple-border/50 hover:text-text-primary hover:bg-purple/5"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border",
                              activeItem === item.id
                                ? "bg-cyan text-white border-cyan"
                                : "bg-purple-translucent border-purple-border"
                            )}>
                              {section.id}.{itemIndex + 1}
                            </div>
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Connection line between sections */}
                  {index < sections.length - 1 && (
                    <div className="ml-8 w-0.5 h-6 bg-purple-border my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel (Right) */}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-surface border border-purple-border rounded-xl p-6 h-full">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {currentItem?.title}
              </h3>
              
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {currentItem?.description}
                  </p>
                </div>

                {/* Image */}
                {currentItem?.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-purple-border/60">
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Additional Info */}
                {currentItem?.details && (
                  <div className="mt-4 pt-4 border-t border-purple-border">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Detalles adicionales</h4>
                    <ul className="space-y-2">
                      {currentItem.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-text-secondary text-xs">
                          <span className="text-cyan mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section Context */}
                <div className="mt-4 pt-4 border-t border-purple-border">
                  <div className="bg-purple-translucent/30 rounded-lg p-3">
                    <p className="text-xs text-text-secondary italic">
                      {currentSection?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;