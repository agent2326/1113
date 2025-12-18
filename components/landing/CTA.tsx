
import React from 'react';
import { CTAConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { MagneticButton } from './Effects';

interface Props {
  id?: string;
  data: CTAConfig;
  theme: string;
  primaryColor: string;
  buttonTextColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  enableAnimations: boolean;
  isActive?: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const getTypographyStyle = (settings?: TypographySettings, defaultFont?: string) => ({
    fontFamily: settings?.fontFamily || defaultFont,
    fontWeight: settings?.fontWeight,
    fontSize: settings?.fontSize ? `${settings.fontSize}px` : undefined,
    lineHeight: settings?.lineHeight,
    letterSpacing: settings?.letterSpacing ? `${settings.letterSpacing}em` : undefined,
    textTransform: settings?.textTransform,
    color: settings?.color
});

const CTA: React.FC<Props> = ({ 
    id, data, theme, primaryColor, buttonTextColor, fontHeading, fontBody, borderRadius, enableAnimations, 
    isActive,
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
    onSelect 
}) => {
  if (!data.show) return null;
  
  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = 'transparent';
  if (isHighContrastLight) defaultBg = '#ffffff';
  if (isHighContrastDark) defaultBg = '#000000';
  
  // UPDATED BACKGROUND LOGIC
  let bgStyle = {};
  if (data.backgroundImage) {
      bgStyle = { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  } else if (data.backgroundType === 'linear') {
      bgStyle = { backgroundImage: `linear-gradient(${data.bgDirection || 90}deg, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` };
  } else if (data.backgroundType === 'radial' || data.backgroundType === 'gradient') {
      bgStyle = { backgroundImage: `radial-gradient(circle at center, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` };
  } else {
      bgStyle = { backgroundColor: data.backgroundColor || defaultBg };
  }

  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  // Inner card style
  const specificButtonBg = data.buttonColor;
  const specificButtonText = data.buttonTextColor;

  let cardBg = 'var(--primary-color)';
  let cardText = 'var(--text-button)';
  
  // Default Button Styles (Standard Mode)
  let buttonBg = specificButtonBg || '#ffffff';
  let buttonText = specificButtonText || 'var(--primary-color)';
  
  let cardBorder = '';
  let buttonBorder = '';
  let buttonHover = 'hover:bg-gray-50';
  let glowClass = '';
  let transformClass = 'hover:-translate-y-1';

  // Extended Button Logic
  if (design.buttonStyle === 'glow') {
      glowClass = 'shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]';
  }
  if (design.buttonStyle === 'neumorphic') {
      buttonBg = '#f3f4f6';
      buttonText = 'var(--primary-color)';
      glowClass = 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
      transformClass = 'hover:scale-[0.98] active:scale-[0.95]';
      buttonHover = '';
  }
  if (design.buttonStyle === 'outline') {
      buttonBg = 'transparent';
      buttonText = '#ffffff';
      buttonBorder = 'border-2 border-white';
      buttonHover = 'hover:bg-white/10';
  }

  // Handle High Contrast Overrides
  if (isHighContrastLight) {
     cardBg = '#ffffff';
     cardText = '#000000';
     buttonBg = '#ffffff';
     buttonText = '#000000';
     cardBorder = 'border-4 border-black';
     buttonBorder = 'border-2 border-black';
     buttonHover = 'hover:bg-black hover:text-white';
  } else if (isHighContrastDark) {
     cardBg = '#000000';
     cardText = '#ffffff';
     buttonBg = '#000000';
     buttonText = '#ffffff';
     cardBorder = 'border-4 border-white';
     buttonBorder = 'border-2 border-white';
     buttonHover = 'hover:bg-white hover:text-black';
  }

  // Radius map
  const radiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-3xl'
  }[borderRadius] || 'rounded-3xl';

  const buttonRadius = design.buttonStyle === 'pill' ? 'rounded-full' : (borderRadius === 'full' ? 'rounded-full' : radiusClass);

  const animationType = (data.animation || design.animation || 'slide-up') as any;
  const duration = design.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group ${isActive ? 'ring-4 ring-blue-500 ring-inset z-50' : ''}`}
      style={bgStyle}
    >
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

      <Reveal enabled={enableAnimations} animation={animationType} duration={duration}>
        <div 
          className={`max-w-4xl mx-auto text-center py-16 px-6 shadow-2xl ${radiusClass} ${cardBorder} ${data.enableHoverEffect ? 'hover:scale-105 transition-transform duration-300' : ''}`}
          style={{ backgroundColor: cardBg }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6 font-[var(--heading-font)]"
            style={{ color: data.headingTypography?.color || cardText }}
          >
            {data.title}
          </h2>
          <p 
            className="text-xl mb-10 max-w-2xl mx-auto font-[var(--body-font)]"
            style={{ color: data.bodyTypography?.color || cardText, opacity: 0.9 }}
          >
            {data.description}
          </p>
          <MagneticButton enabled={design.buttonStyle === 'magnetic'}>
            <button 
                className={`font-bold py-4 px-10 transition-all shadow-md ${buttonRadius} ${buttonBorder} ${buttonHover} ${glowClass} ${transformClass} bg-[var(--primary-color)] text-[var(--text-button)] font-[var(--heading-font)]`}
                style={{ backgroundColor: buttonBg, color: buttonText }}
                onClick={(e) => e.preventDefault()}
            >
                {data.buttonText}
            </button>
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  );
};

export default CTA;
