import React, { useState } from 'react';
import { FAQ_DATA } from '../data/academyData';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FadeInOnScroll } from './FadeInOnScroll';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200/60 text-[#1a1a2e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll direction="up">
          <div className="text-center mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0d47a1] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              Preguntas Frecuentes
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a0e27]">
              ¿Tienes dudas sobre nuestra academia?
            </h2>
          </div>
        </FadeInOnScroll>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, idx) => (
            <FadeInOnScroll key={idx} direction="up" delay={idx * 80}>
              <div
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-sm sm:text-base text-[#0a0e27] hover:text-[#ff6f00] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      openIndex === idx ? 'rotate-180 text-[#ff6f00]' : ''
                    }`}
                  />
                </button>

                {openIndex === idx && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 leading-relaxed animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
