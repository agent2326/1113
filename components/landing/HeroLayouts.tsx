
import React from 'react';
import { 
  ArrowRight, Play, Check, Star, Download, Search, 
  MessageCircle, Code, Command, Shield, Zap, Globe
} from 'lucide-react';
import { HeroConfig } from '../../types';

// --- COMMON COMPONENTS ---
const ActionButtons = ({ data, primaryColor, buttonTextColor, design }: any) => {
  const btnStyle = design?.buttonStyle || 'rounded';
  const radiusClass = btnStyle === 'pill' ? 'rounded-full' : btnStyle === 'square' ? 'rounded-none' : 'rounded-lg';
  
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      {data.showButton && (
        <a 
          href={data.ctaLink || '#'}
          className={`px-8 py-4 ${radiusClass} font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 bg-[var(--primary-color)] text-[var(--text-button)]`}
        >
          {data.ctaText}
          <ArrowRight size={20} />
        </a>
      )}
      {data.showSecondaryButton && (
        <a 
          href={data.secondaryCtaLink || '#'}
          className={`px-8 py-4 ${radiusClass} font-bold text-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2`}
          style={{ color: data.textColor || 'inherit' }}
        >
          {data.secondaryCtaText || 'Learn More'}
        </a>
      )}
    </div>
  );
};

// --- LAYOUTS ---

export const HeroSplitRight = ({ data, titleClass, primaryColor, enableAnimations, design }: any) => (
  <div className="container mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
    <div className={`${enableAnimations ? 'animate-fade-in-up' : ''}`}>
      <h1 className={`${titleClass} font-[var(--heading-font)] font-bold mb-6 leading-tight`}>{data.title}</h1>
      <p className="text-xl md:text-2xl opacity-90 mb-8 font-light max-w-lg">{data.subtitle}</p>
      <ActionButtons data={data} primaryColor={primaryColor} buttonTextColor={data.buttonTextColor} design={design} />
      {data.showTrustIndicators && (
          <div className="mt-12 flex items-center gap-4 text-sm opacity-70">
              <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800" />)}
              </div>
              <p>Trusted by 1000+ companies</p>
          </div>
      )}
    </div>
    <div className={`relative ${enableAnimations ? 'animate-fade-in-left' : ''}`}>
       {data.image ? (
           <img 
              src={data.image} 
              alt="Hero" 
              className={`w-full object-cover shadow-2xl ${data.imageCustomBorderRadius || 'rounded-2xl'} transform hover:scale-[1.02] transition-transform duration-500`}
              style={{ boxShadow: data.imageShadow !== 'none' ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none' }} 
           />
       ) : (
           <div className="w-full aspect-video bg-gray-200/20 rounded-2xl animate-pulse flex items-center justify-center">
               <span className="opacity-50">Image Placeholder</span>
           </div>
       )}
    </div>
  </div>
);

export const HeroSplitLeft = ({ data, titleClass, primaryColor, enableAnimations, design }: any) => (
  <div className="container mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
    <div className={`order-2 md:order-1 relative ${enableAnimations ? 'animate-fade-in-right' : ''}`}>
       <img 
          src={data.image || "https://placehold.co/800x600"} 
          alt="Hero" 
          className={`w-full object-cover shadow-2xl ${data.imageCustomBorderRadius || 'rounded-2xl'}`} 
       />
    </div>
    <div className={`order-1 md:order-2 ${enableAnimations ? 'animate-fade-in-up' : ''}`}>
      <h1 className={`${titleClass} font-[var(--heading-font)] font-bold mb-6 leading-tight`}>{data.title}</h1>
      <p className="text-xl md:text-2xl opacity-90 mb-8 font-light">{data.subtitle}</p>
      <ActionButtons data={data} primaryColor={primaryColor} buttonTextColor={data.buttonTextColor} design={design} />
    </div>
  </div>
);

export const HeroCentered = ({ data, titleClass, primaryColor, enableAnimations, design }: any) => (
  <div className="container mx-auto px-4 py-24 md:py-40 relative z-10 text-center flex flex-col items-center">
    <div className={`max-w-4xl ${enableAnimations ? 'animate-fade-in-up' : ''}`}>
      <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6 uppercase tracking-wider">New Feature</span>
      <h1 className={`${titleClass} font-[var(--heading-font)] font-bold mb-6 leading-tight`}>{data.title}</h1>
      <p className="text-xl md:text-2xl opacity-90 mb-10 font-light max-w-2xl mx-auto">{data.subtitle}</p>
      <div className="flex justify-center">
          <ActionButtons data={data} primaryColor={primaryColor} buttonTextColor={data.buttonTextColor} design={design} />
      </div>
    </div>
    {data.image && (
        <div className="mt-16 w-full max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
                src={data.image} 
                className={`relative w-full rounded-2xl shadow-2xl border border-white/10 ${enableAnimations ? 'animate-fade-in-up delay-200' : ''}`}
                alt="Dashboard"
            />
        </div>
    )}
  </div>
);

export const HeroVideo = ({ data, titleClass, primaryColor, enableAnimations }: any) => (
  <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
          {(data.backgroundImage && data.backgroundImage.endsWith('.mp4')) || (data.videoUrl) ? (
               <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
               >
                  <source src={data.backgroundImage || data.videoUrl} type="video/mp4" />
               </video>
          ) : (
               <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white/20">No Video Source</div>
          )}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
           <div className={`max-w-4xl mx-auto ${enableAnimations ? 'animate-fade-in-up' : ''}`}>
                <h1 className={`${titleClass} font-[var(--heading-font)] font-bold mb-6 drop-shadow-lg`}>{data.title}</h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto drop-shadow-md">{data.subtitle}</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2">
                        <Play size={20} fill="currentColor" /> Watch Showreel
                    </button>
                    {data.showButton && (
                        <a href={data.ctaLink} className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                            {data.ctaText}
                        </a>
                    )}
                </div>
           </div>
      </div>
  </div>
);

export const HeroSaaS = ({ data, titleClass, primaryColor, enableAnimations, design }: any) => (
   <div className="container mx-auto px-4 py-24 grid lg:grid-cols-12 gap-12 items-center">
       <div className="lg:col-span-5 space-y-8">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
               v2.0 Released
           </div>
           <h1 className={`${titleClass} font-[var(--heading-font)] font-bold tracking-tight text-gray-900`}>{data.title}</h1>
           <p className="text-xl text-gray-600 leading-relaxed">{data.subtitle}</p>
           
           <div className="flex flex-col sm:flex-row gap-4 pt-2">
               <div className="relative">
                   <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full sm:w-64 px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   />
               </div>
               <button 
                  className="px-6 py-4 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition-all bg-[var(--primary-color)]"
               >
                  Get Started
               </button>
           </div>
           <div className="text-sm text-gray-400 flex items-center gap-4">
               <span className="flex items-center gap-1"><Check size={14} className="text-green-500"/> No credit card</span>
               <span className="flex items-center gap-1"><Check size={14} className="text-green-500"/> 14-day trial</span>
           </div>
       </div>
       <div className="lg:col-span-7 relative">
           <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[2rem] transform rotate-2"></div>
           <img src={data.image} className="relative rounded-xl shadow-2xl border border-gray-200 w-full" alt="SaaS Interface" />
       </div>
   </div>
);

export const HeroMinimal = ({ data, titleClass, primaryColor }: any) => (
    <div className="container mx-auto px-4 py-32 max-w-3xl text-center">
        <h1 className={`${titleClass} font-[var(--heading-font)] font-bold mb-8 tracking-tighter`}>{data.title}</h1>
        <p className="text-2xl text-gray-500 font-light mb-12 leading-relaxed">{data.subtitle}</p>
        <div className="h-px w-24 bg-gray-900 mx-auto mb-12"></div>
        <ActionButtons data={data} primaryColor={primaryColor} buttonTextColor={data.buttonTextColor} design={{ buttonStyle: 'outline' }} />
    </div>
);

export const HeroChat = HeroCentered;
export const HeroCode = HeroSplitRight;
export const HeroVideoModal = HeroCentered;
export const HeroBrowser = HeroCentered;
export const HeroMasonry = HeroSplitLeft;
export const HeroComparison = HeroSplitRight;
export const HeroTimer = HeroCentered;
export const HeroSearch = HeroCentered;
export const HeroTripod = HeroCentered;
export const HeroTabs = HeroCentered;
export const HeroCover = HeroVideo;
export const HeroForm = HeroSaaS;
export const HeroGrid = HeroSplitRight;
export const HeroOverlap = HeroCentered;
