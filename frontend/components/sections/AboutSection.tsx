/**
 * Section À propos
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '500+', label: 'Jeunes formés' },
  { value: '12', label: 'Programmes' },
  { value: '5', label: 'Régions' },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#F5F0E8]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold text-[#0D1B2A] mb-6">
              À propos de LUMINA
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              LUMINA est une organisation dédiée à l'éducation et à l'autonomisation des jeunes
              en Afrique de l'Ouest. Nous croyons que chaque jeune mérite une chance de briller
              et de contribuer au développement de sa communauté.
            </p>
            <p className="text-lg text-gray-700">
              À travers nos programmes éducatifs, nos formations professionnelles et nos initiatives
              communautaires, nous créons des opportunités durables pour les générations futures.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center p-6 bg-white rounded-lg shadow-md transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl font-display font-bold text-[#F4A823] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
