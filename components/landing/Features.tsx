
import React from 'react';
import * as Icons from 'lucide-react';
import { FeaturesConfig, DesignConfig } from '../../types';

interface Props {
  id?: string;
  data: FeaturesConfig;
  theme: string;
  fontHeading: string;
  fontBody: string;
  secondaryColor: string;
  borderRadius: string;
  enableAnimations: boolean;
  isActive?: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const Features: React.FC<Props> = ({ 
    id, data, theme, fontHeading, fontBody, secondaryColor, borderRadius, enableAnimations, 
    isActive,
    design = { animation: 'slide-up', animationDuration: 'normal' },
    onSelect 
}) => {
  if (!data.show) return null;

  const isDark = theme.includes('dark') || theme === 'midnight';
  const radiusClass = borderRadius === 'none' ? 'rounded-none' : borderRadius === '2xl' || borderRadius === 'full' ? 'rounded-2xl' : 'rounded-lg';
  
  // --- Background Logic ---
  let sectionStyle: React.CSSProperties = {
      paddingTop: data.padding ? (data.padding === 'py-0' ? '0px' : data.padding === 'py-32' ? '128px' : parseInt(data.padding.replace('py-', '')) * 4 + 'px') : '80px',
      paddingBottom: data.padding ? (data.padding === 'py-0' ? '0px' : data.padding === 'py-32' ? '128px' : parseInt(data.padding.replace('py-', '')) * 4 + 'px') : '80px',
  };

  if (data.backgroundType === 'linear' && data.gradientStart) {
      sectionStyle.backgroundImage = `linear-gradient(${data.bgDirection || 135}deg, ${data.gradientStart}, ${data.gradientEnd || data.gradientStart})`;
  } else if (data.backgroundType === 'image' && data.backgroundImage) {
      sectionStyle.backgroundImage = `url(${data.backgroundImage})`;
      sectionStyle.backgroundSize = 'cover';
      sectionStyle.backgroundPosition = 'center';
      if (data.enableParallax) sectionStyle.backgroundAttachment = 'fixed';
  } else {
      sectionStyle.backgroundColor = data.backgroundColor || 'var(--bg-color)';
  }

  // --- Card Style Factory ---
  const getCardClasses = (style: string = 'flat') => {
      const base = `p-6 ${radiusClass} transition-all duration-300 h-full flex flex-col group`;
      
      switch (style) {
          case 'glass':
              return `${base} bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20`;
          case 'neumorphic':
              return `${base} ${isDark 
                  ? 'bg-[#1f2937] shadow-[5px_5px_10px_#151c26,-5px_-5px_10px_#293648]' 
                  : 'bg-[#f3f4f6] shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]'}`;
          case 'hover-lift':
              return `${base} bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700`;
          case 'border':
              return `${base} bg-transparent border-2 border-current hover:bg-current hover:text-white`;
          case 'glow-border':
               return `${base} bg-gray-900 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] text-white`;
          default: // flat
              return `${base} bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700`;
      }
  };

  const cardClass = getCardClasses(data.cardStyle || (data.id === 'features-gradient' ? 'glass' : 'flat'));
  
  // --- Typography Override Helpers ---
  const titleStyle: React.CSSProperties = {
      fontSize: data.itemTitleSize ? `${data.itemTitleSize}px` : undefined,
      color: data.itemTitleColor || undefined,
      fontFamily: 'var(--heading-font)',
      marginBottom: data.itemTitleGap ? `${data.itemTitleGap}px` : '0.5rem'
  };

  const descStyle: React.CSSProperties = {
      fontSize: data.itemDescSize ? `${data.itemDescSize}px` : undefined,
      color: data.itemDescColor || undefined,
      fontFamily: 'var(--body-font)'
  };

  // Container Width
  const containerClass = data.containerWidth === 'full' 
      ? 'w-full px-4' 
      : data.containerWidth === 'narrow' 
          ? 'max-w-4xl mx-auto px-4' 
          : 'container mx-auto px-4'; // default boxed

  // Animation Delay helper
  const getDelay = (index: number) => {
      if (!enableAnimations || design.animation === 'none') return {};
      return { animationDelay: `${index * 100}ms` };
  };

  const animationClass = enableAnimations && design.animation !== 'none' 
      ? `anim-${design.animation}` 
      : '';

  return (
    <section 
      id={id} 
      className={`relative overflow-hidden cursor-pointer ${enableAnimations ? 'anim-fade-in' : ''} ${isActive ? 'ring-4 ring-blue-500 ring-inset z-50' : ''}`}
      style={sectionStyle}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
    >
      {/* Optional Overlay for Image BG */}
      {data.backgroundType === 'image' && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/80'}`}></div>
      )}

      <div className={`relative z-10 ${containerClass}`}>
        <div className={`text-center mb-16 max-w-3xl mx-auto ${animationClass}`}>
          <h2 
            className="text-4xl md:text-5xl font-[var(--heading-font)] font-bold mb-6 leading-tight" 
            style={{ 
                color: data.textColor || (data.cardStyle === 'glass' || data.cardStyle === 'glow-border' ? '#ffffff' : undefined) 
            }}
          >
            {data.title}
          </h2>
          <p 
            className="text-xl opacity-90 leading-relaxed font-[var(--body-font)]" 
            style={{ 
                color: data.textColor || (data.cardStyle === 'glass' || data.cardStyle === 'glow-border' ? '#e5e7eb' : undefined)
            }}
          >
            {data.description || data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.items.map((feature, index) => {
            // Icon handling
            const IconComponent = (Icons as any)[feature.icon || 'Star'];
            
            return (
              <div 
                key={index} 
                className={`${cardClass} ${animationClass}`}
                style={{
                    ...getDelay(index),
                    borderColor: data.cardBorderColor,
                    borderWidth: data.cardBorderWidth ? `${data.cardBorderWidth}px` : undefined,
                    backgroundColor: feature.backgroundColor || data.cardBackgroundColor, // Override if set
                    boxShadow: data.cardShadow === 'none' ? 'none' : undefined
                }}
              >
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-[var(--primary-color)] group-hover:text-[var(--text-button)]"
                     style={{ 
                         backgroundColor: data.cardStyle === 'glass' ? 'rgba(255,255,255,0.2)' : undefined,
                         color: data.cardStyle === 'glass' ? '#fff' : 'var(--secondary-color)' 
                     }}
                >
                  {IconComponent && <IconComponent size={28} />}
                </div>
                <h3 className="text-xl font-bold mb-3" style={titleStyle}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed opacity-80" style={descStyle}>
                  {feature.description || feature.text || feature.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
