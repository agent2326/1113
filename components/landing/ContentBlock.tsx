
import React from 'react';
import Features from './Features';
import Gallery from './Gallery';
import Testimonials from './Testimonials';
import Timeline from './Timeline';
import Process from './Process';
import Team from './Team';
import TwoColumnInfo from './TwoColumnInfo';
import Steps from './Steps';
import Manifesto from './Manifesto';
import ValueProposition from './ValueProposition';
import Philosophy from './Philosophy';
import PullQuotes from './PullQuotes';
import ContactForm from './ContactForm';
import CTA from './CTA';
import Ticker from './Ticker';
import { ContentBlock, TypographySettings } from '../../types';

interface ContentBlockRendererProps {
  id: string;
  data: ContentBlock;
  theme: string;
  primaryColor: string;
  secondaryColor?: string;
  fontHeading: string;
  fontBody: string;
  borderRadius?: string;
  enableAnimations: boolean;
  isActive?: boolean;
  design?: any;
  onSelect?: () => void;
}

const getTypographyStyle = (settings?: TypographySettings, defaultFontVar?: string) => ({
    fontFamily: settings?.fontFamily ? `"${settings.fontFamily}", sans-serif` : `var(${defaultFontVar})`,
    fontWeight: settings?.fontWeight,
    fontSize: settings?.fontSize ? `${settings.fontSize}px` : undefined,
    lineHeight: settings?.lineHeight,
    letterSpacing: settings?.letterSpacing ? `${settings.letterSpacing}em` : undefined,
    textTransform: settings?.textTransform,
    color: settings?.color
});

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ 
  data, 
  id,
  isActive,
  ...props 
}) => {
  // If block is hidden - don't render it
  if (!data.show) return null;

  // Normalize type
  const type = data.type;

  switch (type) {
    case 'features':
      return <Features id={id} data={data as any} isActive={isActive} {...props} secondaryColor={props.secondaryColor || props.primaryColor} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'gallery':
      return <Gallery id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'testimonials':
      return <Testimonials id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'timeline':
      return <Timeline id={id} data={data as any} isActive={isActive} {...props} secondaryColor={props.secondaryColor || props.primaryColor} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'process':
      return <Process id={id} data={data as any} isActive={isActive} {...props} secondaryColor={props.secondaryColor || props.primaryColor} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'team':
      return <Team id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'steps':
      return <Steps id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;
      
    case 'manifesto':
      return <Manifesto id={id} data={data as any} isActive={isActive} {...props} />;

    case 'value-proposition': 
    case 'valueProposition':
      return <ValueProposition id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;

    case 'philosophy':
      return <Philosophy id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;

    case 'pull-quotes':
    case 'pullQuotes':
      return <PullQuotes id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;

    case 'two-column-info':
    case 'twoColumnInfo':
      return <TwoColumnInfo id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;
    
    case 'cta':
      return <CTA id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} buttonTextColor={props.theme === 'dark' ? '#000000' : '#ffffff'} />;

    case 'contactForm':
      return <ContactForm id={id} data={data as any} isActive={isActive} {...props} borderRadius={props.borderRadius || 'lg'} />;
      
    case 'ticker': 
      return (
        <div 
          onClick={(e) => { e.stopPropagation(); props.onSelect?.(); }}
          className={`cursor-pointer ${isActive ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
        >
          <Ticker data={data} fontBody={props.fontBody} />
        </div>
      );

    // DEFAULT BLOCK (If type not found or is Generic Content)
    default:
      // Alignment Logic
      let alignClass = 'text-center';
      if (data.textAlign === 'left') alignClass = 'text-left';
      if (data.textAlign === 'right') alignClass = 'text-right';

      // Typography Logic
      const headingStyle = getTypographyStyle(data.headingTypography, '--heading-font');
      const bodyStyle = getTypographyStyle(data.bodyTypography, '--body-font');

      const { 
          itemTitleSize, itemTitleWeight, itemTitleSpacing, itemTitleGap,
          itemDescSize, itemDescWeight, itemDescSpacing 
      } = data;

      return (
        <section 
          id={id}
          onClick={(e) => { e.stopPropagation(); props.onSelect?.(); }}
          className={`relative group cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-200 ${data.padding || 'py-20'} ${isActive ? 'ring-4 ring-blue-500 ring-inset z-50' : ''} bg-[var(--bg-color)]`}
          style={{ 
            color: data.textColor || '#000000' 
          }}
        >
          <div className={`container mx-auto px-4 max-w-4xl ${alignClass}`}>
             {data.title && (
               <h2 
                 className="text-4xl font-bold mb-6 widget-custom-title font-[var(--heading-font)]" 
                 style={headingStyle}
               >
                 {data.title}
               </h2>
             )}
             {(data.content || data.description) && (
               <div 
                 className="prose prose-lg mx-auto whitespace-pre-wrap widget-custom-desc font-[var(--body-font)]" 
                 style={bodyStyle}
               >
                 {data.content || data.description}
               </div>
             )}
             {data.image && (
                 <div className="mt-8">
                     <img src={data.image} alt={data.title} className="rounded-lg shadow-lg mx-auto max-h-[500px] object-cover" />
                 </div>
             )}

             {/* Render Items for Generic Block if they exist */}
             {data.items && data.items.length > 0 && (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left`}>
                    {data.items.map((item: any, idx: number) => {
                        const itemTitle = item.title || item.name;
                        const itemText = item.description || item.text || item.content || item.bio;
                        return (
                            <div key={idx} className="p-6 border border-gray-100 rounded-lg shadow-sm bg-white/50 backdrop-blur-sm">
                                {itemTitle && (
                                    <h3 
                                        className="font-bold mb-2 text-lg font-[var(--heading-font)]"
                                        style={{ 
                                            fontSize: item.titleFontSize ? `${item.titleFontSize}px` : (itemTitleSize ? `${itemTitleSize}px` : undefined),
                                            fontWeight: item.titleFontWeight || itemTitleWeight,
                                            letterSpacing: item.titleLetterSpacing ? `${item.titleLetterSpacing}px` : (itemTitleSpacing ? `${itemTitleSpacing}px` : undefined),
                                            color: item.textColor,
                                            marginBottom: itemTitleGap ? `${itemTitleGap}px` : undefined
                                        }}
                                    >
                                        {itemTitle}
                                    </h3>
                                )}
                                {itemText && (
                                    <p 
                                        className="opacity-80 leading-relaxed font-[var(--body-font)]"
                                        style={{ 
                                            fontSize: item.descFontSize ? `${item.descFontSize}px` : (itemDescSize ? `${itemDescSize}px` : undefined),
                                            fontWeight: item.descFontWeight || itemDescWeight,
                                            letterSpacing: itemDescSpacing ? `${itemDescSpacing}px` : undefined,
                                            color: item.textColor
                                        }}
                                    >
                                        {itemText}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
             )}
          </div>
        </section>
      );
  }
};

export default ContentBlockRenderer;
