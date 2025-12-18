
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X, PlayCircle } from 'lucide-react';
import { ContentBlock, TypographySettings } from '../../types';

interface Props {
  id?: string;
  data: ContentBlock;
  theme?: string;
  fontHeading?: string;
  fontBody?: string;
  primaryColor?: string;
  borderRadius?: string;
  enableAnimations?: boolean;
  isActive?: boolean;
  design?: any;
  onSelect?: () => void;
}

const getHoverClass = (effect?: string) => {
    switch(effect) {
        case 'zoom': return 'transition-transform duration-500 ease-out group-hover/card:scale-110';
        case 'lift': return 'transition-transform duration-300'; // Applied to container usually
        case 'grayscale': return 'grayscale transition-all duration-500 group-hover/card:grayscale-0';
        case 'rotate': return 'transition-transform duration-500 group-hover/card:rotate-3 group-hover/card:scale-105';
        case 'blur': return 'transition-all duration-500 group-hover/card:blur-[2px]';
        default: return 'transition-transform duration-500';
    }
};

const getTypographyStyle = (settings?: TypographySettings, defaultFont?: string) => ({
    fontFamily: settings?.fontFamily || defaultFont,
    fontWeight: settings?.fontWeight,
    fontSize: settings?.fontSize ? `${settings.fontSize}px` : undefined,
    lineHeight: settings?.lineHeight,
    letterSpacing: settings?.letterSpacing ? `${settings.letterSpacing}em` : undefined,
    textTransform: settings?.textTransform,
    color: settings?.color
});

const Gallery: React.FC<Props> = ({ id, data, theme, fontHeading, fontBody, primaryColor, borderRadius, enableAnimations, isActive, design, onSelect }) => {
  if (!data.show) return null;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const scroll = (dir: number) => {
      if(sliderRef.current) {
          const amount = data.layout === 'showcase' ? sliderRef.current.offsetWidth : 350;
          sliderRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
      }
  };

  const openLightbox = (index: number) => {
      if (data.enableLightbox !== false) {
          setSelectedImageIndex(index);
          setLightboxOpen(true);
      }
  };

  const isSlider = ['slider', 'showcase', 'filmstrip'].includes(data.layout || '');
  const isDark = theme && ['dark', 'midnight', 'high-contrast-dark'].includes(theme);
  
  // Dynamic Styles
  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || (isDark ? '#111827' : '#f9fafb') };
  const textColor = data.textColor || (isDark ? '#ffffff' : '#111827');

  // Aspect Ratio Logic
  const getAspectRatioClass = () => {
      switch(data.aspectRatio) {
          case 'square': return 'aspect-square';
          case 'video': return 'aspect-video';
          case 'portrait': return 'aspect-[3/4]';
          case 'landscape': return 'aspect-[4/3]';
          case 'cover': return 'h-64'; 
          default: return data.layout === 'masonry' ? 'h-auto' : 'h-64';
      }
  };

  const aspectRatioClass = getAspectRatioClass();

  // Grid Configuration
  const isGridLayout = (data.layout === 'grid' || !data.layout || data.layout === 'masonry' || data.layout === 'wall' || data.layout === 'spotlight');
  
  const gridStyle: React.CSSProperties | undefined = isGridLayout ? {
      display: data.layout === 'masonry' ? 'block' : 'grid', 
      gridTemplateColumns: data.layout !== 'masonry' ? `repeat(${parseInt(String(data.columns || 3))}, 1fr)` : undefined,
      gap: `${data.gap !== undefined ? data.gap : 32}px`
  } : undefined;

  // Determine Container Class based on layout
  let gridContainerClass = 'grid';
  if (data.layout === 'masonry') gridContainerClass = `columns-1 md:columns-2 lg:columns-${parseInt(String(data.columns || 3))} gap-6 space-y-6`;
  else if (data.layout === 'wall') gridContainerClass = 'grid gap-0';
  else if (data.layout === 'split') gridContainerClass = 'flex flex-col gap-0';
  else if (data.layout === 'spotlight') gridContainerClass = 'flex flex-wrap justify-center gap-4';

  // Typography Settings
  const galleryTitleStyle = getTypographyStyle(data.galleryTitleTypography, fontHeading);
  const galleryDescStyle = getTypographyStyle(data.galleryDescTypography, fontBody);
  
  // Section Header Typography Settings
  const sectionHeadingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const sectionBodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  // Overlay Logic: active if 'overlay' effect is selected OR 'hover_reveal_title' is checked
  const isOverlayMode = data.galleryHoverEffect === 'overlay' || data.hover_reveal_title === true;

  // New Title Reveal Logic
  const revealTitleClass = data.hover_reveal_title 
    ? 'absolute bottom-5 left-0 w-full text-center z-10 opacity-0 translate-y-5 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-y-0 pointer-events-none' 
    : '';

  const paddingStyle = data.galleryCardPadding ? { padding: data.galleryCardPadding } : {};

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`relative cursor-pointer group ${data.layout === 'filmstrip' ? 'py-12 bg-black' : 'py-20 px-6'} ${isActive ? 'ring-4 ring-blue-500 ring-inset z-50' : ''}`}
      style={data.layout !== 'filmstrip' ? { ...bgStyle, color: textColor } : { color: '#fff' }}
    >
       {/* Background Overlay */}
       {data.layout !== 'filmstrip' && (
           <>
               <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>
               {data.backgroundImage && <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>}
           </>
       )}

       <div className={`${data.layout === 'filmstrip' ? 'w-full' : 'max-w-7xl mx-auto'} relative z-10`}>
            {/* Header */}
            <div className={`mb-12 ${data.layout === 'filmstrip' ? 'px-6' : ''} ${data.textAlign === 'center' ? 'text-center' : data.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
                {data.title && (
                    <h2 
                        className="text-3xl font-bold mb-4 widget-custom-title" 
                        style={sectionHeadingStyle}
                    >
                        {data.title}
                    </h2>
                )}
                {data.subtitle && (
                    <p 
                        className="text-xl opacity-80 whitespace-pre-wrap widget-custom-desc" 
                        style={sectionBodyStyle}
                    >
                        {data.subtitle}
                    </p>
                )}
            </div>

            {/* --- SLIDER LAYOUTS --- */}
            {isSlider ? (
                <div className="relative group/slider">
                    {/* ARROWS */}
                    {data.galleryArrowShow !== 'none' && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); scroll(-1); }} className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 shadow-lg hover:scale-110 transition-all ${data.galleryArrowShow==='always'?'opacity-100':'opacity-0 group-hover/slider:opacity-100'} ${data.galleryArrowShape==='square'?'rounded-lg':'rounded-full'}`} style={{backgroundColor: data.galleryArrowColor || '#fff', color: data.galleryArrowIconColor || '#000'}}><ChevronLeft size={24}/></button>
                            <button onClick={(e) => { e.stopPropagation(); scroll(1); }} className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 shadow-lg hover:scale-110 transition-all ${data.galleryArrowShow==='always'?'opacity-100':'opacity-0 group-hover/slider:opacity-100'} ${data.galleryArrowShape==='square'?'rounded-lg':'rounded-full'}`} style={{backgroundColor: data.galleryArrowColor || '#fff', color: data.galleryArrowIconColor || '#000'}}><ChevronRight size={24}/></button>
                        </>
                    )}

                    <div ref={sliderRef} className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar ${data.layout === 'filmstrip' ? 'gap-0 bg-black py-8 border-y-4 border-gray-800' : 'gap-6 pb-8 px-2'}`} style={{ scrollbarWidth: 'none' }}>
                        {data.items?.map((item, index) => {
                            const isLink = item.actionType === 'link' && item.buttonUrl;
                            const CardTag = isLink ? 'a' : 'div';
                            const cardProps = isLink ? { href: item.buttonUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

                            return (
                                <CardTag key={index} 
                                    className={`relative flex-shrink-0 snap-center group/card transition-all duration-300 flex flex-col overflow-hidden gallery-item-wrapper
                                        ${data.layout === 'showcase' ? 'min-w-[85vw] md:min-w-[800px] rounded-2xl' : 
                                          data.layout === 'filmstrip' ? 'min-w-[300px] mx-4 border-y-[12px] border-double border-gray-800 bg-black p-0 rounded-none' : 
                                          'min-w-[85vw] md:min-w-[350px] lg:min-w-[400px] rounded-xl'
                                        }
                                        ${data.layout !== 'filmstrip' && (data.galleryHoverEffect === 'lift' || data.galleryHoverEffect === 'zoom') ? 'hover:shadow-2xl' : ''}
                                        ${data.layout !== 'filmstrip' && data.galleryHoverEffect === 'lift' ? '-translate-y-0 hover:-translate-y-2' : ''}
                                        ${data.layout !== 'filmstrip' ? 'shadow-md' : ''}
                                        ${isLink ? 'cursor-pointer block' : ''}
                                    `}
                                    style={{ backgroundColor: data.layout === 'filmstrip' ? '#000' : 'transparent' }}
                                    {...cardProps}
                                >
                                    {/* Image Container */}
                                    <div 
                                        className={`relative ${data.layout === 'showcase' ? 'h-[500px]' : data.layout === 'filmstrip' ? 'h-48 w-full border-y-4 border-white' : 'h-64'} overflow-hidden cursor-pointer`}
                                        onClick={(e) => {
                                            if (isLink) return; // Allow default anchor behavior
                                            openLightbox(index);
                                        }}
                                    >
                                        <img src={item.image || item.url} alt={item.title} className={`w-full h-full object-cover ${getHoverClass(data.galleryHoverEffect || 'zoom')}`} />
                                        
                                        {/* Play Button Overlay */}
                                        {item.showPlayButton && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                                <div className="bg-black/20 rounded-full p-2 backdrop-blur-[1px] transition-transform group-hover/card:scale-110">
                                                    <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                                                </div>
                                            </div>
                                        )}

                                        {isOverlayMode && (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-4 text-center z-10 gallery-overlay">
                                                {item.title && <h3 className="text-white text-xl font-bold translate-y-4 group-hover/card:translate-y-0 transition-transform gallery-custom-title gallery-item-title" style={galleryTitleStyle}>{item.title}</h3>}
                                                {item.description && <p className="text-white/80 mt-2 text-sm translate-y-4 group-hover/card:translate-y-0 transition-transform delay-75 gallery-custom-desc" style={galleryDescStyle}>{item.description}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Below (if not overlay) */}
                                    {!isOverlayMode && data.layout !== 'filmstrip' && (item.title || item.description) && (
                                        <div 
                                            className={`gallery-item-caption flex-1 flex flex-col transition-colors duration-300 w-full ${data.galleryCardPadding ? '' : 'p-6'}`} 
                                            style={{ backgroundColor: data.galleryCardBg || '#ffffff', ...paddingStyle }}
                                        >
                                            {item.title && <h3 className={`font-bold text-lg mb-2 gallery-custom-title gallery-item-title ${revealTitleClass}`} style={{ color: data.galleryCardText, background: 'transparent', ...galleryTitleStyle }}>{item.title}</h3>}
                                            {item.description && <p className="text-sm opacity-80 leading-relaxed gallery-custom-desc" style={{ color: data.galleryCardText, ...galleryDescStyle }}>{item.description}</p>}
                                            {item.buttonText && (
                                                <div className={`mt-auto pt-4 flex ${data.galleryBtnAlign === 'center' ? 'justify-center' : data.galleryBtnAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                                    <span className={`px-4 py-2 text-sm font-medium ${data.galleryBtnRadius || 'rounded-lg'} ${data.galleryBtnStyle==='outline'?'border':''}`}
                                                    style={{ 
                                                        backgroundColor: data.galleryBtnStyle==='outline'?'transparent':(data.galleryBtnBg||'#000'), 
                                                        color: data.galleryBtnStyle==='outline'?(data.galleryBtnBg||'#000'):(data.galleryBtnText||'#fff'),
                                                        borderColor: data.galleryBtnBg||'#000'
                                                    }}>
                                                        {item.buttonText}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardTag>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* --- GRID / MASONRY / WALL / SPLIT / SPOTLIGHT --- */
                <div className={gridContainerClass} style={gridStyle}>
                    {data.items?.map((item, index) => {
                        const isLink = item.actionType === 'link' && item.buttonUrl;
                        const CardTag = isLink ? 'a' : 'div';
                        const cardProps = isLink ? { href: item.buttonUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

                        // Special Split Layout
                        if (data.layout === 'split') {
                            return (
                                <div key={index} className={`flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} group/card overflow-hidden bg-white gallery-item-wrapper`}>
                                    <div className="w-full md:w-1/2 h-[400px] relative cursor-pointer" onClick={() => !isLink && openLightbox(index)}>
                                        <img src={item.image || item.url} className={`w-full h-full object-cover ${getHoverClass(data.galleryHoverEffect || 'zoom')}`} alt=""/>
                                        {item.showPlayButton && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                                <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>
                                    <div 
                                        className={`gallery-item-caption w-full md:w-1/2 flex flex-col justify-center transition-colors duration-300 ${data.galleryCardPadding ? '' : 'p-12'}`} 
                                        style={{ backgroundColor: data.galleryCardBg || '#fff', ...paddingStyle }}
                                    >
                                        <h3 className="text-3xl font-bold mb-4 gallery-custom-title gallery-item-title" style={{ color: data.galleryCardText, background: 'transparent', ...galleryTitleStyle }}>{item.title}</h3>
                                        <p className="opacity-80 leading-relaxed mb-6 gallery-custom-desc" style={{ color: data.galleryCardText, ...galleryDescStyle }}>{item.description}</p>
                                        {item.buttonText && <a href={item.buttonUrl||'#'} className="self-start px-6 py-3 bg-black text-white rounded-lg">{item.buttonText}</a>}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <CardTag key={index} 
                                className={`relative group/card overflow-hidden break-inside-avoid gallery-item-wrapper
                                    ${data.layout !== 'wall' ? 'rounded-xl' : ''}
                                    ${data.layout !== 'wall' && data.layout !== 'spotlight' && data.galleryHoverEffect === 'lift' ? 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300' : ''}
                                    ${data.layout !== 'wall' && data.layout !== 'spotlight' ? 'shadow-md' : ''}
                                    ${data.layout === 'spotlight' ? 'w-[300px] h-[300px] opacity-60 hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-0 hover:z-10 rounded-xl' : ''}
                                    ${isLink ? 'cursor-pointer block' : ''}
                                `}
                                style={{ backgroundColor: 'transparent' }}
                                {...cardProps}
                            >
                                <div 
                                    className={`relative ${data.layout === 'wall' ? 'aspect-square' : aspectRatioClass} overflow-hidden cursor-pointer`}
                                    onClick={(e) => {
                                        if (isLink) return;
                                        openLightbox(index);
                                    }}
                                >
                                    <img src={item.image || item.url} alt={item.title} className={`w-full h-full object-cover ${getHoverClass(data.galleryHoverEffect || 'zoom')}`} />
                                    
                                    {/* Play Button Overlay */}
                                    {item.showPlayButton && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                            <div className="bg-black/20 rounded-full p-2 backdrop-blur-[1px] transition-transform group-hover/card:scale-110">
                                                <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Overlay Effect */}
                                    {isOverlayMode && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-4 text-center z-10 gallery-overlay">
                                            {item.title && <h3 className="text-white text-xl font-bold gallery-custom-title gallery-item-title translate-y-4 group-hover/card:translate-y-0 transition-transform" style={galleryTitleStyle}>{item.title}</h3>}
                                            {item.description && <p className="text-white/80 mt-2 text-sm gallery-custom-desc translate-y-4 group-hover/card:translate-y-0 transition-transform delay-75" style={galleryDescStyle}>{item.description}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Content Below */}
                                {!isOverlayMode && data.layout !== 'wall' && data.layout !== 'spotlight' && (
                                    <div 
                                        className={`gallery-item-caption transition-colors duration-300 ${data.galleryCardPadding ? '' : 'p-6'}`} 
                                        style={{ backgroundColor: data.galleryCardBg || '#ffffff', ...paddingStyle }}
                                    >
                                        {item.title && <h3 className={`font-bold text-lg mb-2 gallery-custom-title gallery-item-title ${revealTitleClass}`} style={{ color: data.galleryCardText, background: 'transparent', ...galleryTitleStyle }}>{item.title}</h3>}
                                        {item.description && <p className="text-sm opacity-80 gallery-custom-desc" style={{ color: data.galleryCardText, ...galleryDescStyle }}>{item.description}</p>}
                                    </div>
                                )}
                            </CardTag>
                        );
                    })}
                </div>
            )}
       </div>

       {/* LIGHTBOX */}
       {lightboxOpen && data.enableLightbox !== false && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}>
              <button onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }} className="absolute top-4 right-4 text-white hover:text-gray-300 z-[101] bg-white/10 p-2 rounded-full"><X size={32} /></button>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev - 1 + (data.items?.length||0)) % (data.items?.length||1)); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-[101] bg-white/10 rounded-full"><ChevronLeft size={40} /></button>
              <div className="max-w-6xl max-h-[90vh] w-full relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                  <img src={data.items?.[selectedImageIndex].image || data.items?.[selectedImageIndex].url} alt="" className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"/>
                  {(data.items?.[selectedImageIndex].title || data.items?.[selectedImageIndex].description) && (
                      <div className="mt-4 text-center text-white">
                          <h3 className="font-bold text-2xl mb-1">{data.items?.[selectedImageIndex].title}</h3>
                          <p className="text-lg opacity-80">{data.items?.[selectedImageIndex].description}</p>
                      </div>
                  )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev + 1) % (data.items?.length||1)); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-[101] bg-white/10 rounded-full"><ChevronRight size={40} /></button>
          </div>
      )}
    </section>
  );
};

export default Gallery;
