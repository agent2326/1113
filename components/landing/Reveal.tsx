
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  enabled: boolean;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none' | 'slide-left' | 'slide-right' | 'zoom' | 'flip' | 'bounce' | 'blur-in' | 'pop' | 'flip-3d' | 'skew' | 'wipe' | 'pulse';
  duration?: 'fast' | 'normal' | 'slow' | 'extra-slow';
  delay?: number;
}

const Reveal: React.FC<Props> = ({ children, enabled, className = '', animation = 'slide-up', duration = 'normal', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || animation === 'none') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [enabled, animation, delay]);

  let initialClass = '';
  let visibleClass = '';
  
  // Map duration presets to Tailwind classes
  const durationClass = duration === 'fast' ? 'duration-500' : duration === 'slow' ? 'duration-[1500ms]' : duration === 'extra-slow' ? 'duration-[3000ms]' : 'duration-1000';

  switch (animation) {
      case 'fade':
          initialClass = 'opacity-0';
          visibleClass = 'opacity-100';
          break;
      case 'zoom':
      case 'zoom-in':
          initialClass = 'opacity-0 scale-90';
          visibleClass = 'opacity-100 scale-100';
          break;
      case 'reveal':
          // Clip path reveal effect
          initialClass = 'opacity-0 translate-y-8 blur-sm';
          visibleClass = 'opacity-100 translate-y-0 blur-0';
          break;
      case 'slide-left':
          initialClass = 'opacity-0 -translate-x-12';
          visibleClass = 'opacity-100 translate-x-0';
          break;
      case 'slide-right':
          initialClass = 'opacity-0 translate-x-12';
          visibleClass = 'opacity-100 translate-x-0';
          break;
      case 'flip':
          initialClass = 'opacity-0 [transform:rotateX(90deg)]';
          visibleClass = 'opacity-100 [transform:rotateX(0deg)]';
          break;
      case 'bounce':
          initialClass = 'opacity-0 translate-y-[50px] scale-95';
          visibleClass = 'opacity-100 translate-y-0 scale-100';
          break;
      // --- NEW ANIMATIONS ---
      case 'blur-in':
          initialClass = 'opacity-0 blur-lg scale-95';
          visibleClass = 'opacity-100 blur-0 scale-100';
          break;
      case 'pop':
          initialClass = 'opacity-0 scale-50';
          visibleClass = 'opacity-100 scale-100 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]';
          break;
      case 'flip-3d':
          initialClass = 'opacity-0 [transform:perspective(1000px)_rotateY(-90deg)] backface-hidden';
          visibleClass = 'opacity-100 [transform:perspective(1000px)_rotateY(0deg)]';
          break;
      case 'skew':
          initialClass = 'opacity-0 translate-y-12 skew-y-3';
          visibleClass = 'opacity-100 translate-y-0 skew-y-0';
          break;
      case 'wipe':
          initialClass = 'opacity-0 [clip-path:inset(0_100%_0_0)]';
          visibleClass = 'opacity-100 [clip-path:inset(0_0_0_0)]';
          break;
      case 'pulse':
          initialClass = 'opacity-0 scale-95';
          visibleClass = 'opacity-100 scale-100'; // Simple scale entrance
          break;
      case 'slide-up':
      default:
          initialClass = 'opacity-0 translate-y-12';
          visibleClass = 'opacity-100 translate-y-0';
          break;
  }

  if (animation === 'none' || !enabled) {
      return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={ref} 
      className={`${className} transition-all ease-out ${durationClass} ${isVisible ? visibleClass : initialClass}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
