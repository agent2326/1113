
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavbarConfig } from '../../types';

interface NavbarProps {
  data: NavbarConfig;
  theme: string;
  primaryColor: string;
  fontHeading: string;
  currentLang: string;
  isActive?: boolean;
  onToggleLanguage?: () => void;
  onToggleTheme?: () => void;
  onSelect?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  data, 
  theme, 
  primaryColor, 
  fontHeading, 
  currentLang, 
  isActive,
  onToggleLanguage, 
  onToggleTheme, 
  onSelect 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Configuration values with defaults
  const behavior = data.behavior || (data.navbarSticky === false ? 'static' : 'sticky');
  const isGlass = data.glassEffect !== false; // Default to true if undefined
  const isTransparentOnTop = data.transparentOnTop || false;

  const isDark = ['dark', 'midnight', 'high-contrast-dark', 'ocean', 'forest', 'wine', 'cyberpunk', 'luxury', 'navy', 'hacker', 'dim', 'dracula', 'nord', 'coffee'].includes(theme);

  // --- SCROLL HANDLER ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      // Scrolled state (for transparency/shadow)
      const scrolled = currentScrollY > 20;
      setIsScrolled(scrolled);

      // Smart Behavior Logic
      if (behavior === 'smart') {
        // Always show if at very top or scrolling up significantly
        if (currentScrollY < 50) {
           setIsVisible(true);
        } else if (isScrollingDown && scrollDelta > 10) {
           setIsVisible(false);
        } else if (!isScrollingDown && scrollDelta > 5) {
           setIsVisible(true);
        }
      } else {
        // Static or Sticky always visible
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [behavior]);

  if (!data.show) return null;

  // --- STYLE CALCULATION ---

  // Positioning
  const positionClass = behavior === 'static' ? 'absolute' : 'fixed';
  
  // Transform (for Smart Hide)
  const transformClass = (!isVisible && !isMobileMenuOpen) ? '-translate-y-full' : 'translate-y-0';

  // Base Background Color
  const configuredBg = data.backgroundColor || (isDark ? '#111827' : '#ffffff');
  
  // Helper to inject opacity into Hex color if needed
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    if (hex.startsWith('rgba')) return hex; // Already rgba
    if (hex.startsWith('#')) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
  };

  let finalBgColor = configuredBg;
  let backdropClass = '';
  let shadowClass = '';

  // Determine Background State
  if (isTransparentOnTop && !isScrolled && !isMobileMenuOpen) {
      finalBgColor = 'transparent';
      shadowClass = 'shadow-none';
  } else {
      // Solid/Glass State
      if (isGlass) {
          backdropClass = 'backdrop-blur-md';
          // Convert solid color to semi-transparent if it's opaque
          finalBgColor = hexToRgba(configuredBg, 0.85); 
      } else {
          // Solid opaque
          finalBgColor = configuredBg;
      }
      
      if (isScrolled || isMobileMenuOpen) {
          shadowClass = isDark ? 'shadow-md shadow-black/20' : 'shadow-sm';
      }
  }

  // Border logic
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const borderStyle = (isScrolled || isMobileMenuOpen) ? `1px solid ${borderColor}` : '1px solid transparent';

  // Text Color
  const baseTextColor = (isTransparentOnTop && !isScrolled && !isMobileMenuOpen) 
      ? (data.textColor || (isDark ? '#ffffff' : '#111827')) 
      : (data.textColor || (isDark ? '#ffffff' : '#111827'));

  // Typography Override Helper
  const getCustomStyle = (settings: any, defaultFontVar: string, defaultColor: string) => {
    return {
      fontFamily: settings?.fontFamily ? `"${settings.fontFamily}", sans-serif` : `var(${defaultFontVar})`,
      fontWeight: settings?.fontWeight,
      fontSize: settings?.fontSize ? `${settings.fontSize}px` : undefined,
      lineHeight: settings?.lineHeight,
      letterSpacing: settings?.letterSpacing ? `${settings.letterSpacing}em` : undefined,
      textTransform: settings?.textTransform as any,
      color: settings?.color || defaultColor,
    };
  };

  const logoStyle = getCustomStyle(data.headingTypography, '--heading-font', baseTextColor);
  const linkStyle = getCustomStyle(data.bodyTypography, '--body-font', baseTextColor);

  return (
    <nav 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`navbar-wrapper ${positionClass} top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ease-in-out cursor-pointer ${transformClass} ${backdropClass} ${shadowClass} ${isActive ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
      style={{ 
        backgroundColor: finalBgColor,
        borderBottom: borderStyle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            {data.logoImage ? (
              <img src={data.logoImage} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <span 
                className="font-bold text-2xl tracking-tight"
                style={logoStyle}
              >
                {data.logoText || 'Brand'}
              </span>
            )}
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            {data.links?.map((link: any, index: number) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={linkStyle}
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center gap-2 pl-4 border-l border-gray-200/20">
              {/* LANGUAGE TOGGLE */}
              {onToggleLanguage && !data.hideLangToggle && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLanguage(); }}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100/10 flex items-center gap-1"
                  style={{ color: linkStyle.color }}
                  title="Change Language"
                >
                  <Globe size={18} />
                  <span className="text-xs font-bold uppercase">{currentLang}</span>
                </button>
              )}

              {/* THEME TOGGLE */}
              {onToggleTheme && !data.hideThemeToggle && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100/10"
                  style={{ color: linkStyle.color }}
                  title="Toggle Theme"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              {/* ACTION BUTTON */}
              {(data.buttonText || data.ctaText) && data.showButton && (
                <a
                  href={data.buttonLink || data.ctaLink || '#'}
                  className="px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-lg ml-2 bg-[var(--primary-color)] text-[var(--text-button)]"
                >
                  {data.buttonText || data.ctaText}
                </a>
              )}
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100/10 transition-colors"
              style={{ color: linkStyle.color }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden shadow-xl ${isGlass ? 'backdrop-blur-xl' : ''}`}
            style={{ 
                // Ensure mobile menu has solid-ish background for readability
                backgroundColor: isGlass ? hexToRgba(configuredBg || (isDark ? '#111827' : '#ffffff'), 0.95) : (configuredBg || (isDark ? '#111827' : '#ffffff')) 
            }}
          >
            <div className="px-4 pt-2 pb-6 space-y-2 border-t border-gray-100/10">
              {data.links?.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-100/5 transition-colors"
                  style={{ 
                    color: linkStyle.color,
                    fontFamily: linkStyle.fontFamily
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              <div className="pt-4 flex items-center justify-between border-t border-gray-100/10 mt-4 px-2">
                 <div className="flex gap-4">
                    {onToggleLanguage && !data.hideLangToggle && (
                        <button 
                            onClick={onToggleLanguage}
                            className="flex items-center gap-2 text-sm font-medium p-2 rounded hover:bg-gray-100/5"
                            style={{ color: linkStyle.color }}
                        >
                            <Globe size={18} />
                            <span className="uppercase">{currentLang}</span>
                        </button>
                    )}
                    {onToggleTheme && !data.hideThemeToggle && (
                        <button 
                            onClick={onToggleTheme}
                            className="flex items-center gap-2 text-sm font-medium p-2 rounded hover:bg-gray-100/5"
                            style={{ color: linkStyle.color }}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                 </div>
                 
                 {(data.buttonText || data.ctaText) && data.showButton && (
                    <a
                      href={data.buttonLink || data.ctaLink || '#'}
                      className="block px-4 py-2 rounded-lg text-center text-sm font-bold bg-[var(--primary-color)] text-[var(--text-button)]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {data.buttonText || data.ctaText}
                    </a>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
