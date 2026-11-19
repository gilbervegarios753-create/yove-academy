import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export type ParallaxIntensity = 'LOW' | 'MEDIUM' | 'HIGH' | 'MINIMAL';

export interface ParallaxLayer {
  id: string;
  depthSpeed: number; // e.g. 0.15, 0.3, 0.5, 0.8, 1.0
  content: React.ReactNode;
  className?: string;
  zIndex?: number;
}

export interface AIParallaxSceneProps {
  id?: string;
  layers: ParallaxLayer[];
  zoomScale?: number; // camera scale zoom e.g. 1.08 or 1.12
  intensity?: ParallaxIntensity;
  mobileBehavior?: 'stack' | 'reduce' | 'disable';
  className?: string;
  children?: React.ReactNode;
}

export const AIParallaxScene: React.FC<AIParallaxSceneProps> = ({
  id,
  layers,
  zoomScale = 1.08,
  intensity = 'MEDIUM',
  mobileBehavior = 'reduce',
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // If user prefers reduced motion or intensity is MINIMAL, skip complex parallax transforms
    if (prefersReducedMotion() || intensity === 'MINIMAL') return;

    // Determine scale multiplier based on device and intensity settings
    const isMobile = window.innerWidth < 768;
    if (isMobile && mobileBehavior === 'disable') return;

    let intensityFactor = 1.0;
    if (intensity === 'LOW' || (isMobile && mobileBehavior === 'reduce')) {
      intensityFactor = 0.35;
    } else if (intensity === 'HIGH') {
      intensityFactor = 1.4;
    }

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Camera Zoom Effect on container element if specified
      if (zoomScale > 1.0 && containerRef.current) {
        const adjustedScale = 1 + (zoomScale - 1) * intensityFactor;
        gsap.to(containerRef.current, {
          scale: adjustedScale,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Parallax Depth Translation for each layer
      layerRefs.current.forEach((layerEl, idx) => {
        if (!layerEl) return;
        const layer = layers[idx];
        if (!layer) return;

        // Depth offset calculation
        const baseSpeed = layer.depthSpeed ?? 0.5;
        const yOffset = (1 - baseSpeed) * 120 * intensityFactor;

        gsap.to(layerEl, {
          y: yOffset,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [layers, zoomScale, intensity, mobileBehavior]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative overflow-hidden w-full transition-transform duration-300 ${className}`}
    >
      {/* Parallax Layers */}
      {layers.map((layer, idx) => (
        <div
          key={layer.id}
          ref={(el) => {
            layerRefs.current[idx] = el;
          }}
          style={{ zIndex: layer.zIndex ?? idx * 10 }}
          className={`w-full ${layer.className || ''}`}
        >
          {layer.content}
        </div>
      ))}

      {/* Main Foreground Content */}
      {children && <div className="relative z-30 w-full">{children}</div>}
    </div>
  );
};
