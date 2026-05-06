'use client';
import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

interface ShadowOverlayProps {
    color?: string;
    animation?: { scale: number; speed: number };
    noise?: { opacity: number; scale: number };
    className?: string;
    style?: CSSProperties;
}

export function EtherealShadow({
    color = 'rgba(15, 23, 42, 0.85)',
    animation = { scale: 80, speed: 70 },
    noise = { opacity: 0.6, scale: 1.1 },
    className = "",
    style
}: ShadowOverlayProps) {
    const id = useId().replace(/:/g, "");
    const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
    const hueRotateMotionValue = useMotionValue(180);
    const animationEnabled = animation.scale > 0;

    useEffect(() => {
        if (!feColorMatrixRef.current || !animationEnabled) return;

        const controls = animate(hueRotateMotionValue, 360, {
            duration: 120 / (animation.speed / 50),
            repeat: Infinity,
            ease: "linear",
            onUpdate: (value) => {
                feColorMatrixRef.current?.setAttribute("values", String(value));
            }
        });

        return () => controls.stop();
    }, [animationEnabled, animation.speed]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={style}>
            <div className="absolute inset-0" style={{ filter: animationEnabled ? `url(#ethereal-${id})` : "none" }}>
                {animationEnabled && (
                    <svg className="absolute w-0 h-0">
                        <defs>
                            <filter id={`ethereal-${id}`}>
                                <feTurbulence
                                    numOctaves="3"
                                    baseFrequency="0.0008"
                                    type="fractalNoise"
                                />
                                <feColorMatrix
                                    ref={feColorMatrixRef}
                                    type="hueRotate"
                                    values="180"
                                />
                                <feDisplacementMap in="SourceGraphic" scale={animation.scale} />
                            </filter>
                        </defs>
                    </svg>
                )}

                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: color,
                        maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
                        maskSize: "cover",
                        maskPosition: "center",
                    }}
                />
            </div>

            {/* Noise Layer */}
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
