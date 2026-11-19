import React from 'react';
import { SPECIALTIES_DATA } from '../data/academyData';
import { BookOpen, Wrench, Laptop, Award, CheckCircle } from 'lucide-react';
import { FadeInOnScroll } from './FadeInOnScroll';

export const SpecialtiesSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-[#0d47a1]" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-[#0d47a1]" />;
      case 'Laptop':
        return <Laptop className="w-8 h-8 text-[#0d47a1]" />;
      case 'Award':
        return <Award className="w-8 h-8 text-[#0d47a1]" />;
      default:
        return <BookOpen className="w-8 h-8 text-[#0d47a1]" />;
    }
  };

  return (
    <section id="especialidades" className="py-20 bg-[#f5f7fa] text-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6f00]">
              Especialidades y Metodología
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0e27]">
              ¿Por Qué Estudiar en Yove Academy?
            </h2>
            <p className="text-base text-gray-600">
              Combinamos el rigor teórico con prácticas intensivas orientadas a la resolución efectiva de problemas en taller.
            </p>
          </div>
        </FadeInOnScroll>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALTIES_DATA.map((spec, index) => (
            <FadeInOnScroll
              key={spec.id}
              direction="up"
              delay={index * 120}
              className="flex flex-col"
            >
              <div
                className="bg-white rounded-xl p-8 shadow-[0_3px_10px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-[#ff6f00]/10 transition-colors">
                    {getIcon(spec.iconName)}
                  </div>

                  <h3 className="text-xl font-bold text-[#0d47a1] mb-3 group-hover:text-[#ff6f00] transition-colors">
                    {spec.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {spec.description}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {spec.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-[#ff6f00] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
