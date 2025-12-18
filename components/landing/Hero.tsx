
import React from 'react';
import { HeroConfig, DesignConfig } from '../../types';
import * as Layouts from './HeroLayouts';

interface Props {
  id?: string;
  data: HeroConfig;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  buttonTextColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  enableAnimations: boolean;
  isActive?: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const Hero: React.FC<Props> = ({ 
    id, data, theme, primaryColor, secondaryColor, buttonTextColor, fontHeading, fontBody, borderRadius, enableAnimations, 
    isActive,
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const layout = data.layout || 'split-right';
  
  // Font size calculation based on settings or defaults
  const titleSizeClass = {
    'small': 'text-4xl',
    'medium': 'text-5xl',
    'large': 'text-6xl md:text-7xl',
    'xl': 'text-7xl md:text-8xl'
  }[data.titleSize as string] || 'text-5xl md:text-6xl';

  const isDark = theme.includes('dark') || theme === 'midnight';
  
  // Background Logic
  let backgroundStyle: React.CSSProperties = {};
  if (data.backgroundImage && layout !== 'cover' && layout !== 'video' && layout !== 'overlap') {
      backgroundStyle = { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  } else if (data.backgroundType === 'linear') {
      backgroundStyle = { backgroundImage: `linear-gradient(${data.bgDirection || 90}deg, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` };
  } else if (data.backgroundType === 'radial' || data.backgroundType === 'gradient') {
      backgroundStyle = { backgroundImage: `radial-gradient(circle at center, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` };
  } else {
      backgroundStyle = { backgroundColor: data.backgroundColor || (isDark ? '#111827' : '#ffffff') };
  }

  // Layout Component Map
  const LayoutComponents: any = {
    'split-right': Layouts.HeroSplitRight,
    'split-left': Layouts.HeroSplitLeft,
    'centered': Layouts.HeroCentered,
    'cover': Layouts.HeroCover,
    'minimal': Layouts.HeroMinimal,
    'saas': Layouts.HeroSaaS,
    'video': Layouts.HeroVideo,
    'form': Layouts.HeroForm,
    'grid': Layouts.HeroGrid,
    'overlap': Layouts.HeroOverlap,
    // NEW LAYOUTS
    'chat': Layouts.HeroChat,
    'code': Layouts.HeroCode,
    'video-modal': Layouts.HeroVideoModal,
    'browser': Layouts.HeroBrowser,
    'masonry': Layouts.HeroMasonry,
    'comparison': Layouts.HeroComparison,
    'timer': Layouts.HeroTimer,
    'search': Layouts.HeroSearch,
    'tripod': Layouts.HeroTripod,
    'tabs': Layouts.HeroTabs,
  };

  const SelectedLayout = LayoutComponents[layout] || Layouts.HeroSplitRight;

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`relative overflow-hidden cursor-pointer group font-sans ${isActive ? 'ring-4 ring-blue-500 ring-inset z-50' : ''}`}
      style={{ 
          ...backgroundStyle, 
          color: data.textColor || (isDark ? '#fff' : '#111827'),
          fontFamily: fontBody
      }}
    >
      {/* Font Heading Override for Title inside layouts */}
      <div style={{ fontFamily: fontHeading }}>
          <SelectedLayout 
            data={data} 
            titleClass={titleSizeClass} 
            primaryColor={primaryColor}
            enableAnimations={enableAnimations}
          />
      </div>
    </section>
  );
};

export default Hero;
