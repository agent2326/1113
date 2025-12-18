
import React, { useState } from 'react';
import { ContactFormConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe } from 'lucide-react';

interface Props {
  id?: string;
  data: ContactFormConfig;
  theme: string;
  primaryColor: string;
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

const SocialIcon = ({ platform, className }: { platform: string, className?: string }) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <Facebook className={className} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className={className} />;
    if (p.includes('instagram')) return <Instagram className={className} />;
    if (p.includes('linkedin')) return <Linkedin className={className} />;
    if (p.includes('youtube')) return <Youtube className={className} />;
    if (p.includes('github')) return <Github className={className} />;
    return <Globe className={className} />;
};

const ContactForm: React.FC<Props> = ({ 
    id, data, theme, primaryColor, fontHeading, fontBody, borderRadius, enableAnimations, 
    isActive,
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const { 
      formLayout = 'centered', 
      formContainerWidth = 'boxed',
      buttonAlign, 
      formInputBg, formLabelColor, formTextColor, 
      formInputBorderColor, formInputBorderWidth,
      namePlaceholder, emailPlaceholder, messagePlaceholder, phonePlaceholder, subjectPlaceholder,
      formBtnBg, formBtnText, formBtnHoverBg, formBtnHoverText,
      formBtnFontSize, formBtnWeight, 
      formBtnPadding, formBtnShadow,
      address, phone, email, buttonUrl,
      hideLabels,
      showNameField = true,
      showPhoneField,
      showSubjectField,
      showMap,
      mapEmbedUrl,
      socialLinks,
      // Granular props
      formInputHeight = 'medium',
      formGridGap = 'medium',
      formWidth = 'medium',
      formInputShadow = 'sm',
      formInputRadiusClass, // 'none', 'sm', 'md', 'lg', 'full'
      formInputStyle = 'outlined', // 'outlined', 'filled', 'underlined'
      formBtnLetterSpacing,
      formBtnPaddingClass = 'medium',
      formBtnTextSize = 'base',
      formContainerShadow = 'none'
  } = data;

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormState('submitting');
      setTimeout(() => {
          setFormState('success');
          if (buttonUrl) {
              window.location.href = buttonUrl;
          }
      }, 1500);
  };

  const isHighContrast = theme.includes('high-contrast');
  const isDark = ['dark', 'midnight', 'high-contrast-dark', 'ocean', 'forest', 'wine', 'cyberpunk', 'luxury', 'navy', 'hacker', 'dim', 'dracula', 'nord', 'coffee'].includes(theme);

  // --- STYLE GENERATION ---

  // 1. Layout & Sizing
  const heightClass = {
      small: 'py-2 px-3 text-sm',
      medium: 'py-3 px-4 text-base',
      large: 'py-4 px-5 text-lg'
  }[formInputHeight || 'medium'];

  const gapClass = {
      small: 'gap-4',
      medium: 'gap-6',
      large: 'gap-8'
  }[formGridGap || 'medium'];

  const formMaxWidth = {
      narrow: 'max-w-md',
      medium: 'max-w-2xl',
      full: 'w-full'
  }[formWidth || 'medium'];

  // 2. Input Styles
  // Map radius settings
  const radiusMap: Record<string, string> = {
      'none': 'rounded-none',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'xl': 'rounded-xl',
      '2xl': 'rounded-2xl',
      'full': 'rounded-full'
  };
  
  // Default to theme radius if not set, or specific override
  const effectiveRadius = formInputRadiusClass || 'md';
  const radiusClass = radiusMap[effectiveRadius] || 'rounded-md';

  const shadowClass = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      inner: 'shadow-inner'
  }[formInputShadow || 'sm'];

  // Input Variants Logic
  let variantClasses = '';
  // Colors for variants
  const defaultBorder = isDark ? 'border-gray-700' : 'border-gray-300';
  const defaultFocusRing = 'focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500';
  const defaultBg = isDark ? 'bg-gray-800' : 'bg-white';
  const filledBg = isDark ? 'bg-gray-800' : 'bg-gray-100';

  // Apply extra padding if rounded-full (pill) to prevent text clipping
  const paddingX = effectiveRadius === 'full' ? 'px-6' : (formInputStyle === 'underlined' ? 'px-0' : 'px-4');

  if (formInputStyle === 'underlined') {
      // Minimal
      variantClasses = `border-b-2 border-t-0 border-x-0 rounded-none bg-transparent ${isDark ? 'border-gray-700 focus:border-white' : 'border-gray-300 focus:border-black'} focus:ring-0 shadow-none placeholder-gray-400`;
  } else if (formInputStyle === 'filled') {
      // Modern
      variantClasses = `border border-transparent ${filledBg} focus:bg-transparent ${isDark ? 'focus:border-gray-600' : 'focus:border-gray-300'} focus:ring-0 transition-colors placeholder-gray-500`;
  } else {
      // Classic (Outlined)
      variantClasses = `border ${defaultBorder} ${defaultBg} ${defaultFocusRing} ${shadowClass} placeholder-gray-400`;
  }

  // Combine Input Classes
  // NOTE: If style is 'underlined', we force rounded-none regardless of radius setting for inputs
  const inputRadius = formInputStyle === 'underlined' ? 'rounded-none' : radiusClass;
  const inputStyleClass = `w-full block ${heightClass} ${paddingX} ${inputRadius} ${variantClasses} transition-all duration-200 outline-none resize-y`;

  // 3. Button Styles
  const btnPaddingClass = {
      small: 'px-6 py-2',
      medium: 'px-8 py-3',
      large: 'px-10 py-4'
  }[formBtnPaddingClass || 'medium'];

  const btnSpacingClass = {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest'
  }[formBtnLetterSpacing || 'normal'];

  const btnTextSizeClass = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
  }[formBtnTextSize || 'base'];

  const btnWeightClass = {
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '900': 'font-black'
  }[formBtnWeight || '700'] || 'font-bold';

  // Button radius should follow the setting
  const btnRadiusClass = radiusClass;

  // Container Shadow & Width
  const containerShadowClass = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl'
  }[formContainerShadow || 'none'];

  const containerPaddingClass = formContainerShadow && formContainerShadow !== 'none' ? 'p-8 bg-white/50 backdrop-blur-sm rounded-2xl' : '';

  // Input Colors (Inline overrides)
  const inputDynamicStyle: React.CSSProperties = {
      backgroundColor: formInputBg, 
      borderColor: formInputBorderColor, 
      borderWidth: formInputBorderWidth ? `${formInputBorderWidth}px` : undefined,
      color: formTextColor || (isDark ? '#ffffff' : '#111827'),
  };

  const btnDynamicStyle: React.CSSProperties = {
      backgroundColor: isHovered ? (formBtnHoverBg || primaryColor) : (formBtnBg || primaryColor),
      color: isHovered ? (formBtnHoverText || '#ffffff') : (formBtnText || '#ffffff'),
      fontSize: formBtnFontSize ? `${formBtnFontSize}px` : undefined, 
      fontFamily: fontHeading,
      boxShadow: formBtnShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderColor: formInputBorderColor || 'transparent'
  };

  const labelStyle = { color: formLabelColor || (isDark ? '#9ca3af' : '#374151') };

  // Background for Section
  let bgStyle = {};
  if (data.backgroundImage) {
      bgStyle = { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  } else if (data.backgroundType === 'linear') {
      bgStyle = { backgroundImage: `linear-gradient(${data.bgDirection || 90}deg, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` };
  } else if (data.backgroundType === 'radial' || data.backgroundType === 'gradient') {
      bgStyle = { backgroundImage: `radial-gradient(circle at center, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` };
  } else {
      bgStyle = { backgroundColor: data.backgroundColor || (isDark ? '#111827' : '#ffffff') };
  }

  // --- RENDER HELPERS ---
  
  // FIX: Full Width Logic to act on Wrapper
  const containerWidthClass = formContainerWidth === 'full' 
      ? 'w-full max-w-none px-4 md:px-10' 
      : 'max-w-7xl mx-auto px-4';
      
  const isSplitLeft = formLayout === 'split_left';
  const isSplitRight = formLayout === 'split_right';
  const isMinimal = formLayout === 'minimal';

  const MapComponent = () => {
      if (!showMap) return null;
      const defaultMapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98513032404069!3d40.7588949713861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1716300000000!5m2!1sen!2sus";
      return (
          <div className={`w-full h-full min-h-[350px] overflow-hidden shadow-lg bg-gray-100 ${radiusClass}`}>
              <iframe src={mapEmbedUrl || defaultMapSrc} width="100%" height="100%" style={{ border: 0, minHeight: '350px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </div>
      );
  };

  const ContactInfoComponent = () => (
      <div className="space-y-8 h-full flex flex-col justify-center">
          {address && (
              <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-full bg-blue-100/10 shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: primaryColor }}>
                      <MapPin size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-1" style={{ fontFamily: fontHeading }}>Address</h4>
                      <p className="opacity-80 whitespace-pre-wrap" style={{ fontFamily: fontBody }}>{address}</p>
                  </div>
              </div>
          )}
          {phone && (
              <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-full bg-blue-100/10 shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: primaryColor }}>
                      <Phone size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-1" style={{ fontFamily: fontHeading }}>Phone</h4>
                      <p className="opacity-80" style={{ fontFamily: fontBody }}>{phone}</p>
                  </div>
              </div>
          )}
          {email && (
              <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-full bg-blue-100/10 shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: primaryColor }}>
                      <Mail size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-1" style={{ fontFamily: fontHeading }}>Email</h4>
                      <p className="opacity-80" style={{ fontFamily: fontBody }}>{email}</p>
                  </div>
              </div>
          )}
          {socialLinks && socialLinks.length > 0 && (
              <div className="pt-4 border-t border-gray-200/20">
                  <div className="flex gap-4 flex-wrap">
                      {socialLinks.map((social, idx) => (
                          <a key={idx} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-gray-100/10 transition-all hover:-translate-y-1" style={{ color: primaryColor }}>
                              <SocialIcon platform={social.platform || 'globe'} className="w-5 h-5" />
                          </a>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );

  const FormComponent = () => (
      <div className={`w-full ${formMaxWidth} mx-auto ${containerShadowClass} ${containerPaddingClass}`}>
          {formState === 'success' ? (
              <div className={`p-10 text-center rounded-2xl border ${isDark ? 'bg-green-900/10 border-green-800' : 'bg-green-50 border-green-100'}`}>
                  <h3 className="text-2xl font-bold text-green-600 mb-3">Message Sent!</h3>
                  <p className="mb-6 opacity-80">{data.successMessage}</p>
                  <button onClick={() => setFormState('idle')} className="text-sm underline font-bold opacity-70 hover:opacity-100">Send another message</button>
              </div>
          ) : (
              <form onSubmit={handleSubmit} className={`flex flex-col ${gapClass}`}>
                  {showNameField && (
                      <div className="w-full">
                          {!hideLabels && <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80" style={labelStyle}>Name</label>}
                          <input type="text" placeholder={namePlaceholder || 'Your Name'} required className={inputStyleClass} style={inputDynamicStyle} />
                      </div>
                  )}

                  <div className={`grid grid-cols-1 md:grid-cols-2 ${gapClass}`}>
                      <div>
                          {!hideLabels && <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80" style={labelStyle}>Email</label>}
                          <input type="email" placeholder={emailPlaceholder || 'email@example.com'} required className={inputStyleClass} style={inputDynamicStyle} />
                      </div>
                      {showPhoneField && (
                          <div>
                              {!hideLabels && <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80" style={labelStyle}>Phone</label>}
                              <input type="tel" placeholder={phonePlaceholder || '+1 555...'} className={inputStyleClass} style={inputDynamicStyle} />
                          </div>
                      )}
                  </div>

                  {showSubjectField && (
                      <div>
                          {!hideLabels && <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80" style={labelStyle}>Subject</label>}
                          <input type="text" placeholder={subjectPlaceholder || 'Inquiry...'} className={inputStyleClass} style={inputDynamicStyle} />
                      </div>
                  )}

                  <div>
                      {!hideLabels && <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80" style={labelStyle}>Message</label>}
                      <textarea rows={4} placeholder={messagePlaceholder || 'How can we help?'} required className={inputStyleClass} style={inputDynamicStyle} />
                  </div>

                  <div className={`flex ${buttonAlign === 'center' ? 'justify-center' : buttonAlign === 'right' ? 'justify-end' : buttonAlign === 'stretch' ? 'w-full' : 'justify-start'}`}>
                      <button type="submit" 
                          disabled={formState === 'submitting'}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          className={`transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${buttonAlign === 'stretch' ? 'w-full' : ''} ${btnRadiusClass} ${btnPaddingClass} ${btnSpacingClass} ${btnTextSizeClass} ${btnWeightClass}`}
                          style={btnDynamicStyle}
                      >
                          {formState === 'submitting' ? 'Sending...' : (data.buttonText || 'Send Message')}
                      </button>
                  </div>
              </form>
          )}
      </div>
  );

  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';
  const textColor = data.textColor || (isDark ? '#ffffff' : '#111827');
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-24 ${parallaxClass} ${data.enableGrayscale?'grayscale':''} ${data.enableSepia?'sepia':''} relative cursor-pointer group ${isActive ? 'ring-4 ring-blue-500 ring-inset z-50' : ''}`}
      style={{ ...bgStyle, color: textColor }}
    >
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>
      
      {data.backgroundImage && <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>}

      <div className={`${containerWidthClass} relative z-10`}>
        <Reveal enabled={enableAnimations} animation="slide-up" duration="normal" className="text-center mb-16">
          {data.title && <h2 className="text-4xl md:text-5xl font-bold mb-6" style={headingStyle}>{data.title}</h2>}
          {data.subtitle && <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed" style={bodyStyle}>{data.subtitle}</p>}
        </Reveal>

        {isMinimal ? (
            <div className="flex justify-center">
                <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
                    <ContactInfoComponent />
                    {showMap && <div className="h-full min-h-[300px]"><MapComponent /></div>}
                </div>
            </div>
        ) : (
            <div className={`grid grid-cols-1 ${isSplitLeft || isSplitRight ? 'lg:grid-cols-2 gap-12 lg:gap-24' : 'gap-12'}`}>
                <div className={`${isSplitRight ? 'order-2' : 'order-1'} ${!isSplitLeft && !isSplitRight && 'hidden'}`}>
                    <div className="h-full flex flex-col gap-10">
                        {showMap ? <MapComponent /> : <ContactInfoComponent />}
                        {showMap && (address || phone || email) && <ContactInfoComponent />}
                    </div>
                </div>

                <div className={`${isSplitRight ? 'order-1' : 'order-2'} ${!isSplitLeft && !isSplitRight ? 'w-full' : ''}`}>
                    <Reveal enabled={enableAnimations} animation="slide-up" duration="normal" delay={200}>
                        <FormComponent />
                    </Reveal>
                </div>
            </div>
        )}
        
        {/* Centered Layout Fallback for Info */}
        {!isSplitLeft && !isSplitRight && !isMinimal && (address || phone || email) && (
             <div className="mt-16 pt-16 border-t border-gray-200/20 max-w-4xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                     {address && <div><div className="inline-block p-3 rounded-full bg-blue-100/10 mb-4" style={{color:primaryColor}}><MapPin/></div><h4 className="font-bold">Address</h4><p className="opacity-70 text-sm">{address}</p></div>}
                     {phone && <div><div className="inline-block p-3 rounded-full bg-blue-100/10 mb-4" style={{color:primaryColor}}><Phone/></div><h4 className="font-bold">Phone</h4><p className="opacity-70 text-sm">{phone}</p></div>}
                     {email && <div><div className="inline-block p-3 rounded-full bg-blue-100/10 mb-4" style={{color:primaryColor}}><Mail/></div><h4 className="font-bold">Email</h4><p className="opacity-70 text-sm">{email}</p></div>}
                 </div>
             </div>
        )}
      </div>
    </section>
  );
};

export default ContactForm;
