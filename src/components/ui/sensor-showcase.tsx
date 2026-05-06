"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lightbulb, Zap, Radio, Gauge, Compass, Palette, ExternalLink, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorData {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  specs: string[];
  gradient: string;
  glowColor: string;
}

const sensorsData: SensorData[] = [
  {
    id: 'light-sensor',
    name: 'Light Sensor (CdS)',
    icon: Lightbulb,
    description: 'Analog light sensor for detecting ambient light levels and line following on Botball robots. Essential for following black lines on white surfaces or vice versa.',
    specs: ['0-5V Range', 'Analog Output', 'Fast Response', 'Line Tracking'],
    gradient: 'from-yellow-500/20 via-orange-500/20 to-amber-500/20',
    glowColor: 'rgba(251, 191, 36, 0.5)',
  },
  {
    id: 'et-rangefinder',
    name: 'ET Rangefinder',
    icon: Radio,
    description: 'Infrared distance sensor for precise distance measurement up to 80cm. Uses infrared light to detect objects and measure range for obstacle avoidance.',
    specs: ['10-80cm Range', 'Analog Signal', 'IR Emitter/Receiver', '98% Accuracy'],
    gradient: 'from-purple-500/20 via-violet-500/20 to-indigo-500/20',
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  {
    id: 'small-tophat',
    name: 'Small Tophat (IR)',
    icon: Radio,
    description: 'Compact infrared sensor for short-range object detection and line following. Combines IR emitter and receiver in a small form factor.',
    specs: ['Short Range', 'IR Technology', 'Compact Design', 'Line Detection'],
    gradient: 'from-blue-500/20 via-cyan-500/20 to-sky-500/20',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  {
    id: 'large-tophat',
    name: 'Large Tophat (IR)',
    icon: Radio,
    description: 'Larger infrared sensor with extended range for object detection and distance measurement. More powerful than the small tophat.',
    specs: ['Extended Range', 'IR Technology', 'High Sensitivity', 'Adjustable'],
    gradient: 'from-indigo-500/20 via-blue-500/20 to-cyan-500/20',
    glowColor: 'rgba(99, 102, 241, 0.5)',
  },
  {
    id: 'slide-sensor',
    name: 'Slide Sensor',
    icon: Gauge,
    description: 'Linear slide potentiometer that measures linear position. Used for detecting drawer/door positions or linear actuator feedback.',
    specs: ['Linear Range', 'Analog Output', 'Position Sensing', 'Smooth Action'],
    gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
    glowColor: 'rgba(34, 197, 94, 0.5)',
  },
  {
    id: 'large-touch',
    name: 'Large Touch (Button)',
    icon: Zap,
    description: 'Large-format digital touch sensor for collision detection and user input. Robust button-style sensor for detecting contacts and obstacles.',
    specs: ['Digital I/O', 'Large Surface', 'Durable Design', 'Instant Trigger'],
    gradient: 'from-red-500/20 via-pink-500/20 to-rose-500/20',
    glowColor: 'rgba(239, 68, 68, 0.5)',
  },
  {
    id: 'small-touch',
    name: 'Small Touch (Button)',
    icon: Zap,
    description: 'Compact digital touch sensor for space-constrained applications. Perfect for detecting small obstacles or user interface buttons.',
    specs: ['Digital I/O', 'Compact Size', 'Spring-loaded', 'Reliable Contact'],
    gradient: 'from-orange-500/20 via-red-500/20 to-pink-500/20',
    glowColor: 'rgba(249, 115, 22, 0.5)',
  },
  {
    id: 'lever-touch',
    name: 'Lever Touch',
    icon: Gauge,
    description: 'Lever-style touch sensor with extended reach. The lever arm increases the detection area and provides mechanical advantage for triggering.',
    specs: ['Lever Mechanism', 'Extended Reach', 'Digital Output', 'Adjustable Position'],
    gradient: 'from-teal-500/20 via-cyan-500/20 to-blue-500/20',
    glowColor: 'rgba(20, 184, 166, 0.5)',
  },
];

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<'svg'> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={x * width} y={y * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);
}

interface SensorCardProps {
  sensor: SensorData;
  index: number;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const p = genRandomPattern();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-background/95 via-background/90 to-background/95 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl">
        {/* Animated gradient background */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            sensor.gradient
          )}
        />

        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={p}
            className="fill-foreground/5 stroke-foreground/10 absolute inset-0 h-full w-full"
          />
        </div>

        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute rounded-full blur-3xl"
            style={{
              width: '200px',
              height: '200px',
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              background: sensor.glowColor,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Icon */}
          <motion.div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <sensor.icon className="h-8 w-8 text-foreground" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">{sensor.name}</h3>

          {/* Description */}
          <p className="mb-4 flex-grow text-sm leading-relaxed text-muted-foreground">{sensor.description}</p>

          {/* Specs */}
          <div className="space-y-2">
            {sensor.specs.map((spec, specIndex) => (
              <motion.div
                key={specIndex}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: specIndex * 0.1 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>{spec}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface SensorShowcaseProps {
  onScrollNext?: () => void;
  nextLabel?: string;
}

export function SensorShowcase({ onScrollNext, nextLabel }: SensorShowcaseProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background py-16 md:py-24">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <Zap className="h-4 w-4" />
            <span>Botball Sensors</span>
          </motion.div>

          <h2 className="mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
            Sensor Technology
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore the sensor suite that gives Botball robots the ability to perceive and navigate their environment autonomously.
          </p>

          {/* PDF Reference */}
          <motion.a
            href="https://homebase.kipr.org/_files/2011-Workshop-Files/Botball-Documents/2011%20Botball%20Manuals/Sensor_and_Motor_Manual_BB2011.pdf"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Reference: Sensor & Motor Manual (KIPR)</span>
          </motion.a>
        </motion.div>

        {/* Sensor grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sensorsData.map((sensor, index) => (
            <SensorCard key={sensor.id} sensor={sensor} index={index} />
          ))}
        </div>

        {/* Scroll to next section button */}
        {onScrollNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-16"
          >
            <motion.button
              onClick={onScrollNext}
              className="group flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs font-medium tracking-widest">SCROLL TO {nextLabel?.toUpperCase() || "NEXT"}</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowDown className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
