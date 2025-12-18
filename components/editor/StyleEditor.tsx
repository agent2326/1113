import React from 'react';
import { 
  Type, ImageIcon, AlignLeft, AlignCenter, AlignRight, 
  ChevronRight, Box, Zap, Layers, MousePointerClick, 
  Palette, MoveVertical 
} from 'lucide-react';
import TypographyControl from './TypographyControl';

interface StyleEditorProps {
  sectionId: string;
  data: any;
  blockIndex?: number;
  onUpdate: (key: string, value: any) => void;
  onImageUploadTrigger: (section: string, key: string, index?: number) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ 
  sectionId, 
  data, 
  blockIndex, 
  onUpdate, 
  onImageUploadTrigger 
}) => {
  if (!data) return <div className="p-4 text-gray-500 text-sm">Select a section to edit styles.</div>;

  // --- GLOBAL SETTINGS MODE ---
  if (sectionId === 'global') {
      const design = data.design || {};
      return (
          <div className="space-y-6">
              {/* BRANDING COLORS */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                      <Palette size={14} className="text-blue-600"/> Brand Colors
                  </h4>
                  <div className="space-y-3">
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Primary Color</label>
                          <div className="flex gap-2 items-center">
                              <input type="color" value={data.primaryColor || '#2563eb'} onChange={(e) => onUpdate('primaryColor', e.target.value)} className="h-8 w-8 rounded border border-gray-200 p-0 cursor-pointer" />
                              <input type="text" value={data.primaryColor || ''} onChange={(e) => onUpdate('primaryColor', e.target.value)} className="flex-1 border p-1.5 rounded text-sm font-mono" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Secondary Color</label>
                          <div className="flex gap-2 items-center">
                              <input type="color" value={data.secondaryColor || '#4f46e5'} onChange={(e) => onUpdate('secondaryColor', e.target.value)} className="h-8 w-8 rounded border border-gray-200 p-0 cursor-pointer" />
                              <input type="text" value={data.secondaryColor || ''} onChange={(e) => onUpdate('secondaryColor', e.target.value)} className="flex-1 border p-1.5 rounded text-sm font-mono" />
                          </div>
                      </div>
                  </div>
              </div>

              {/* GLOBAL INTERFACE */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                      <MousePointerClick size={14} className="text-purple-600"/> Interface & UX
                  </h4>
                  <div className="space-y-4">
                      {/* Button Style */}
                      <div>
                           <label className="block text-[10px] font-bold text-gray-400 mb-2">Default Button Style</label>
                           <div className="grid grid-cols-4 gap-1">
                               {['rounded', 'pill', 'square', 'outline'].map((s) => (
                                   <button 
                                       key={s}
                                       onClick={() => onUpdate('design.buttonStyle', s)}
                                       className={`py-1.5 text-[10px] border rounded capitalize ${design.buttonStyle === s ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                   >
                                       {s}
                                   </button>
                               ))}
                           </div>
                      </div>

                      {/* Scrollbar Settings */}
                      <div className="pt-4 border-t border-gray-100">
                          <div className="flex justify-between mb-1">
                              <label className="text-[10px] font-bold text-gray-400">Scrollbar Width</label>
                              <span className="text-[10px] text-blue-600 font-mono">{design.scrollWidth || 10}px</span>
                          </div>
                          <input 
                              type="range" min="0" max="20" step="1"
                              value={design.scrollWidth || 10}
                              onChange={(e) => onUpdate('design.scrollWidth', parseInt(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                      </div>
                      
                      <div>
                          <div className="flex justify-between mb-1">
                              <label className="text-[10px] font-bold text-gray-400">Scrollbar Radius</label>
                              <span className="text-[10px] text-blue-600 font-mono">{design.scrollRadius || 10}px</span>
                          </div>
                          <input 
                              type="range" min="0" max="20" step="1"
                              value={design.scrollRadius || 10}
                              onChange={(e) => onUpdate('design.scrollRadius', parseInt(e.target.value))}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                      </div>
                  </div>
              </div>

               {/* GLOBAL TYPOGRAPHY */}
               <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                   <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                      <Type size={14} className="text-gray-600"/> Global Typography
                   </h4>
                   <div className="space-y-3">
                       <TypographyControl label="Headings" prefix="heading" currentData={data} onUpdate={onUpdate} noHeader />
                       <TypographyControl label="Body Text" prefix="body" currentData={data} onUpdate={onUpdate} noHeader />
                   </div>
               </div>
          </div>
      );
  }

  // --- REGULAR SECTION MODE ---
  const hasItems = (data.items && data.items.length > 0) || 
                   ['features', 'testimonials', 'gallery', 'team', 'steps'].includes(data.type);

  const getDesignVal = (key: string, defaultVal: any) => {
      return data.design?.[key] || defaultVal;
  };

  return (
    <div className="space-y-6">
      
      {/* LAYOUT & SPACING */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Box size={14} className="text-blue-600"/> Layout & Spacing
          </h4>
          <div className="space-y-4">
              <div>
                  <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold text-gray-400">Vertical Padding</label>
                      <span className="text-[10px] text-blue-600 font-mono">{data.padding ? data.padding.replace('py-', '') : 'Auto'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <MoveVertical size={12} className="text-gray-400"/>
                      <input 
                          type="range" min="0" max="32" step="4"
                          value={data.padding ? parseInt(data.padding.replace('py-', '')) : 16}
                          onChange={(e) => onUpdate('padding', `py-${e.target.value}`)}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                  </div>
              </div>
              <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2">Container Width</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                      {['narrow', 'boxed', 'full'].map((w) => (
                          <button 
                              key={w} 
                              onClick={() => onUpdate('containerWidth', w)} 
                              className={`flex-1 py-1.5 text-[10px] font-medium rounded capitalize transition-all ${data.containerWidth === w ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                          >
                              {w}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* SECTION DESIGN */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Zap size={14} className="text-purple-600"/> Section Design
          </h4>
          <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                   <div>
                       <label className="block text-[10px] font-bold text-gray-400 mb-1">Animation</label>
                       <select 
                           value={getDesignVal('animation', 'slide-up')}
                           onChange={(e) => onUpdate('design.animation', e.target.value)}
                           className="w-full border p-1.5 rounded text-xs bg-white"
                       >
                           <option value="none">None</option>
                           <option value="fade">Fade In</option>
                           <option value="slide-up">Slide Up</option>
                           <option value="zoom-in">Zoom In</option>
                           <option value="blur-in">Blur</option>
                       </select>
                   </div>
                   <div>
                       <label className="block text-[10px] font-bold text-gray-400 mb-1">Speed</label>
                       <select 
                           value={getDesignVal('animationDuration', 'normal')}
                           onChange={(e) => onUpdate('design.animationDuration', e.target.value)}
                           className="w-full border p-1.5 rounded text-xs bg-white"
                       >
                           <option value="fast">Fast</option>
                           <option value="normal">Normal</option>
                           <option value="slow">Slow</option>
                       </select>
                   </div>
               </div>
               <div>
                   <label className="block text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1">Button Style (Override)</label>
                   <div className="grid grid-cols-4 gap-1">
                       {['rounded', 'pill', 'square', 'outline'].map((s) => (
                           <button 
                               key={s}
                               onClick={() => onUpdate('design.buttonStyle', s)}
                               className={`py-1 text-[9px] border rounded capitalize ${getDesignVal('buttonStyle', 'rounded') === s ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-gray-200 text-gray-500'}`}
                           >
                               {s}
                           </button>
                       ))}
                   </div>
               </div>
          </div>
      </div>

      {/* HERO SPECIFIC */}
      {sectionId === 'hero' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm border-t-4 border-t-blue-600">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                  <ImageIcon size={14}/> Hero Image
              </h4>
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between mb-1">
                          <label className="text-[10px] font-bold text-gray-400">Scale (%)</label>
                          <span className="text-[10px] text-blue-600 font-mono">{data.imageScale || 100}%</span>
                      </div>
                      <input 
                          type="range" min="50" max="150" step="5"
                          value={parseInt(data.imageScale || 100)}
                          onChange={(e) => onUpdate('imageScale', e.target.value)}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Radius</label>
                          <select value={data.imageCustomBorderRadius || 'rounded-lg'} onChange={(e) => onUpdate('imageCustomBorderRadius', e.target.value)} className="w-full border p-1.5 rounded text-xs bg-white">
                              <option value="rounded-none">Square</option>
                              <option value="rounded-lg">Rounded</option>
                              <option value="rounded-2xl">Large</option>
                              <option value="rounded-full">Circle</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Shadow</label>
                          <select value={data.imageShadow || 'none'} onChange={(e) => onUpdate('imageShadow', e.target.value)} className="w-full border p-1.5 rounded text-xs bg-white">
                              <option value="none">None</option>
                              <option value="shadow-lg">Soft</option>
                              <option value="shadow-2xl">Hard</option>
                          </select>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* UNIVERSAL CARDS */}
      {hasItems && (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm border-t-4 border-t-orange-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Layers size={14}/> Cards Design
          </h4>
          <div className="space-y-4">
              <div className="mb-3">
                   <label className="block text-[10px] font-bold text-gray-400 mb-1">Visual Effect</label>
                   <select 
                       value={data.cardStyle || 'flat'}
                       onChange={(e) => onUpdate('cardStyle', e.target.value)}
                       className="w-full border p-1.5 rounded text-xs bg-white mb-2"
                   >
                       <option value="flat">Flat (Default)</option>
                       <option value="hover-lift">Lift on Hover</option>
                       <option value="border">Border Only</option>
                       <option value="glass">Glassmorphism</option>
                       <option value="neumorphic">Neumorphic</option>
                       <option value="glow-border">Glow Border</option>
                   </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Background</label>
                      <div className="flex gap-2 items-center">
                          <input type="color" value={data.cardBackgroundColor || '#ffffff'} onChange={(e) => onUpdate('cardBackgroundColor', e.target.value)} className="h-6 w-8 rounded border border-gray-200 p-0 cursor-pointer" />
                          <input type="text" value={data.cardBackgroundColor || ''} onChange={(e) => onUpdate('cardBackgroundColor', e.target.value)} className="flex-1 border p-1 rounded text-xs font-mono" placeholder="#fff" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Border</label>
                      <div className="flex gap-2 items-center">
                          <input type="color" value={data.cardBorderColor || '#e5e7eb'} onChange={(e) => onUpdate('cardBorderColor', e.target.value)} className="h-6 w-8 rounded border border-gray-200 p-0 cursor-pointer" />
                          <input type="text" value={data.cardBorderColor || ''} onChange={(e) => onUpdate('cardBorderColor', e.target.value)} className="flex-1 border p-1 rounded text-xs font-mono" placeholder="#ccc" />
                      </div>
                  </div>
              </div>
          </div>
      </div>
      )}

      {/* TYPOGRAPHY */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Type size={16} className="text-blue-600" /> Typography
          </h4>
          <div className="space-y-4">
              <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Alignment</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                      {['left', 'center', 'right'].map((align) => (
                          <button
                              key={align}
                              onClick={() => onUpdate('textAlign', align)}
                              className={`flex-1 py-1 flex items-center justify-center rounded transition-all ${data.textAlign === align ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
                          >
                              {align === 'left' && <AlignLeft size={16}/>}
                              {align === 'center' && <AlignCenter size={16}/>}
                              {align === 'right' && <AlignRight size={16}/>}
                          </button>
                      ))}
                  </div>
              </div>
              <details className="group border-t border-gray-100 pt-2">
                  <summary className="flex items-center justify-between py-2 cursor-pointer list-none hover:text-blue-600">
                      <span className="text-xs font-bold text-gray-500 uppercase">Headings</span>
                      <ChevronRight size={14} className="text-gray-400 transform group-open:rotate-90 transition-transform"/>
                  </summary>
                  <div className="pt-2">
                      <TypographyControl label="Headings" prefix="heading" currentData={data} onUpdate={onUpdate} noHeader />
                  </div>
              </details>
          </div>
      </div>

      {/* BACKGROUND */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-600" /> Background
          </h4>
          <div className="w-full mb-3">
            <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => onUpdate('backgroundType', 'solid')} className={`py-1.5 text-[10px] font-medium rounded transition-all ${!data.backgroundType || data.backgroundType === 'solid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Solid</button>
                <button onClick={() => onUpdate('backgroundType', 'linear')} className={`py-1.5 text-[10px] font-medium rounded transition-all ${data.backgroundType === 'linear' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Gradient</button>
                <button onClick={() => onUpdate('backgroundType', 'image')} className={`py-1.5 text-[10px] font-medium rounded transition-all ${data.backgroundType === 'image' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Image</button>
            </div>
          </div>
          <div className="space-y-3">
             {data.backgroundType === 'linear' ? (
                 <>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Start</label>
                            <div className="flex gap-1">
                                <input type="color" value={data.gradientStart || '#ffffff'} onChange={(e) => onUpdate('gradientStart', e.target.value)} className="h-6 w-6 rounded border-0 p-0"/>
                                <input type="text" value={data.gradientStart} onChange={(e) => onUpdate('gradientStart', e.target.value)} className="w-full border rounded text-xs px-1"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-400 mb-1">End</label>
                            <div className="flex gap-1">
                                <input type="color" value={data.gradientEnd || '#f3f4f6'} onChange={(e) => onUpdate('gradientEnd', e.target.value)} className="h-6 w-6 rounded border-0 p-0"/>
                                <input type="text" value={data.gradientEnd} onChange={(e) => onUpdate('gradientEnd', e.target.value)} className="w-full border rounded text-xs px-1"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 mb-1">Direction: {data.bgDirection || 90}°</label>
                        <input type="range" min="0" max="360" step="45" value={data.bgDirection || 90} onChange={(e) => onUpdate('bgDirection', e.target.value)} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                    </div>
                 </>
             ) : data.backgroundType === 'image' ? (
                 <div>
                    <div className="flex gap-2 mb-2">
                       <input className="flex-1 border p-2 rounded text-xs" value={data.backgroundImage || ''} onChange={(e) => onUpdate('backgroundImage', e.target.value)} placeholder="Image URL" />
                       <button onClick={() => onImageUploadTrigger(sectionId, 'backgroundImage', blockIndex)} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><ImageIcon size={16}/></button>
                    </div>
                    <label className="flex items-center justify-between"><span className="text-xs text-gray-500">Parallax</span><input type="checkbox" checked={data.enableParallax || false} onChange={(e) => onUpdate('enableParallax', e.target.checked)} className="rounded text-blue-600" /></label>
                 </div>
             ) : (
                 <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Color</label>
                    <div className="flex gap-2 items-center">
                        <input type="color" value={data.backgroundColor || '#ffffff'} onChange={(e) => onUpdate('backgroundColor', e.target.value)} className="h-8 w-8 rounded border border-gray-200 p-0" />
                        <input type="text" value={data.backgroundColor || ''} onChange={(e) => onUpdate('backgroundColor', e.target.value)} className="flex-1 border p-1.5 rounded text-sm font-mono" />
                    </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default StyleEditor;