
import React from 'react';
import { ContentBlock } from '../../types';

interface TickerProps {
  data: ContentBlock;
  fontBody: string;
}

const Ticker: React.FC<TickerProps> = ({ data, fontBody }) => {
  const { 
      tickerSpeed, tickerDirection, tickerBg, tickerText, tickerSeparator, 
      tickerFontSize, tickerSpacing, tickerGap, tickerFontFamily,
      tickerFontWeight, tickerTransform
  } = data;
  
  const speed = tickerSpeed ? parseInt(tickerSpeed) : 20;
  const isRight = tickerDirection === 'right';
  const gap = tickerGap ? `${tickerGap}px` : '32px';
  
  const items = data.items || [];
  
  if (!items.length) return null;

  return (
    <section id={data.id} className="py-4 overflow-hidden ticker-wrapper" style={{ backgroundColor: tickerBg || '#000000' }}>
      <div className="flex whitespace-nowrap overflow-hidden">
        {/* Quadruple render for seamless loop on wide screens */}
        {[0, 1, 2, 3].map((i) => (
           <div key={i} 
                className={`flex shrink-0 items-center ticker-move-element ${isRight ? 'animate-marquee-reverse' : 'animate-marquee'}`}
                style={{ 
                    animationDuration: `${speed}s`,
                    animationDirection: isRight ? 'reverse' : 'normal'
                }}
           >
              {items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center ticker-text-item" style={{ marginRight: gap }}>
                      <span 
                        className="font-bold tracking-wider" 
                        style={{ 
                            fontFamily: tickerFontFamily || fontBody, 
                            color: tickerText || '#ffffff',
                            fontSize: tickerFontSize ? `${tickerFontSize}px` : '24px',
                            letterSpacing: tickerSpacing ? `${tickerSpacing}px` : 'normal',
                            fontWeight: tickerFontWeight || 'bold',
                            textTransform: (tickerTransform as any) || 'uppercase'
                        }}
                      >
                         {item.title || item.text}
                      </span>
                      {(tickerSeparator || '•') && (
                          <span 
                            className="ml-4 opacity-50"
                            style={{ 
                                fontFamily: tickerFontFamily || fontBody, 
                                color: tickerText || '#ffffff',
                                fontSize: tickerFontSize ? `${tickerFontSize}px` : '24px'
                            }}
                          >
                              {tickerSeparator || '•'}
                          </span>
                      )}
                  </div>
              ))}
           </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee linear infinite; }
        .animate-marquee-reverse { animation: marquee linear infinite reverse; }
      `}</style>
    </section>
  );
};

export default Ticker;
