"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
}

interface BotballSlideshowProps {
  slides?: Slide[];
  autoPlayInterval?: number;
  className?: string;
}

const defaultSlides: Slide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80',
    title: 'BOTBALL ROBOTICS',
    subtitle: 'Innovation in Motion',
    description: 'Building the future through competitive robotics'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
    title: 'TEAM COLLABORATION',
    subtitle: 'Engineering Excellence',
    description: 'Working together to solve complex challenges'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80',
    title: 'AUTONOMOUS SYSTEMS',
    subtitle: 'Advanced Programming',
    description: 'Creating intelligent robotic solutions'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1920&q=80',
    title: 'COMPETITION READY',
    subtitle: 'Tournament Champions',
    description: 'Competing at the highest level'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1920&q=80',
    title: 'STEM EDUCATION',
    subtitle: 'Learning Through Doing',
    description: 'Inspiring the next generation of engineers'
  }
];

export function BotballSlideshow({
  slides = defaultSlides,
  autoPlayInterval = 5000,
  className = ''
}: BotballSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval) as unknown as number;
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide, autoPlayInterval]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            rotateY: { duration: 0.5 }
          }}
          className="absolute inset-0"
          style={{ perspective: 1000 }}
        >
          <div className="relative w-full h-full">
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-md bg-white/10 px-6 py-3 rounded-full border border-white/20"
          >
            <span className="text-white/90 text-sm font-bold tracking-widest">BOTBALL 2024</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="backdrop-blur-md bg-white/10 p-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors pointer-events-auto"
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-4xl"
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight"
              style={{
                textShadow: '0 0 40px rgba(0,0,0,0.5)'
              }}
            >
              {slides[currentIndex].title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {slides[currentIndex].subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-cyan-400 font-light mb-4 tracking-wide"
              >
                {slides[currentIndex].subtitle}
              </motion.p>
            )}

            {slides[currentIndex].description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-base md:text-lg text-white/80 font-light max-w-2xl mx-auto"
              >
                {slides[currentIndex].description}
              </motion.p>
            )}
          </motion.div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={prevSlide}
              className="backdrop-blur-md bg-white/10 p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-110 pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={nextSlide}
              className="backdrop-blur-md bg-white/10 p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-110 pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          <div className="flex flex-col items-end gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group relative"
                >
                  <div className={`w-12 h-1 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-cyan-400'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}>
                    {index === currentIndex && isAutoPlaying && (
                      <motion.div
                        className="absolute inset-0 bg-cyan-400 rounded-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-md bg-white/10 px-6 py-3 rounded-full border border-white/20"
            >
              <span className="text-white/90 text-sm font-bold tracking-widest">
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white/40 text-xs font-mono tracking-widest rotate-180 pointer-events-none hidden md:block"
        style={{ writingMode: 'vertical-rl' } as React.CSSProperties}
      >
        USE ARROW KEYS OR SCROLL
      </div>
    </div>
  );
}
