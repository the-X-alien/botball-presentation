'use client';
import React, { useRef, useId, useEffect } from 'react';
import { animate, useMotionValue } from 'framer-motion';

interface EtherealShadowProps {
  color?: string;
  animation?: { scale: number; speed: number };
  noise?: { opacity: number; scale: number };
  className?: string;
}

export function EtherealShadow({
  color = 'rgba(0, 0, 0, 0.95)',           // Much darker
  animation = { scale: 65, speed: 55 },
  noise = { opacity: 0.25, scale: 1.1 },   // Reduced noise
  className = "",
}: EtherealShadowProps) {
  const id = useId().replace(/:/g, "");
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotate = useMotionValue(180);

  useEffect(() => {
    if (!feColorMatrixRef.current) return;
    const controls = animate(hueRotate, 360, {
      duration: 160 / (animation.speed / 50),
      repeat: Infinity,
      ease: "linear",
      onUpdate: (v) => feColorMatrixRef.current?.setAttribute("values", String(v))
    });
    return () => controls.stop();
  }, [animation.speed]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0" style={{ filter: `url(#ethereal-${id})` }}>
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id={`ethereal-${id}`}>
              <feTurbulence numOctaves="3" baseFrequency="0.0008" type="fractalNoise" />
              <feColorMatrix ref={feColorMatrixRef} type="hueRotate" values="180" />
              <feDisplacementMap in="SourceGraphic" scale={animation.scale} />
            </filter>
          </defs>
        </svg>
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: color, 
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`, 
            maskSize: 'cover', 
            maskPosition: 'center' 
          }} 
        />
      </div>

      {noise.opacity > 0 && (
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: `${noise.scale * 180}px`,
            opacity: noise.opacity,
          }}
        />
      )}
    </div>
  );
}
