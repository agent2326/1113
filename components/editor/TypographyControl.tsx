
import React from 'react';
import { Type, MoveVertical, MoveHorizontal, CaseUpper, CaseLower } from 'lucide-react';
import { TypographySettings } from '../../types';
import { AVAILABLE_FONTS } from '../../constants';

interface TypographyControlProps {
  label: string;
  prefix: string;
  currentData: any;
  onUpdate: (key: string, value: any) => void;
  noHeader?: boolean;
}

const TypographyControl: React.FC<TypographyControlProps> = ({ label, prefix, currentData, onUpdate: updateFunc, noHeader }) => {
  const keyName = `${prefix}Typography`;
  const settings: TypographySettings = currentData[keyName] || {};
  
  const update = (k: keyof TypographySettings, v: any) => {
      updateFunc(keyName, { ...settings, [k]: v });
  };

  const containerClass = noHeader 
    ? "space-y-4" 
    : "space-y-4 pt-2 pb-4 border-b border-gray-100 last:border-0";

  // Determine default font size
  const defaultFontSize = prefix === 'heading' ? 36 : (prefix.toLowerCase().includes('title') ? 24 : 16);

  return (
      <div className={containerClass}>
          {!noHeader && (
            <div className="flex items-center gap-2 mb-2">
                <Type size={14} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
              <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Font Family</label>
                  <select 
                      className="w-full border p-1 rounded text-xs bg-white"
                      value={settings.fontFamily || ''}
                      onChange={(e) => update('fontFamily', e.target.value)}
                  >
                      <option value="">Default</option>
                      {AVAILABLE_FONTS.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f}</option>)}
                  </select>
              </div>
              <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Weight</label>
                  <select 
                      className="w-full border p-1 rounded text-xs bg-white"
                      value={settings.fontWeight || ''}
                      onChange={(e) => update('fontWeight', e.target.value)}
                  >
                      <option value="">Default</option>
                      <option value="100">Thin (100)</option>
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">SemiBold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="900">Black (900)</option>
                  </select>
              </div>
          </div>
          <div>
              <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-gray-400">Size (px)</label>
                  <span className="text-[10px] text-blue-600 font-mono">{settings.fontSize || 'Auto'}</span>
              </div>
              <input 
                  type="range" min="12" max="128" step="1" 
                  value={settings.fontSize || defaultFontSize} 
                  onChange={(e) => update('fontSize', e.target.value)}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
          </div>
          <div className="grid grid-cols-2 gap-3">
              <div>
                  <div className="flex justify-between mb-1">
                      <label className="text-[10px] text-gray-400 flex items-center gap-1"><MoveVertical size={10}/> Line Height</label>
                      <span className="text-[10px] text-gray-500 font-mono">{settings.lineHeight || '-'}</span>
                  </div>
                  <input 
                      type="range" min="0.8" max="2.5" step="0.1" 
                      value={settings.lineHeight || 1.2} 
                      onChange={(e) => update('lineHeight', e.target.value)}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
              </div>
              <div>
                  <div className="flex justify-between mb-1">
                      <label className="text-[10px] text-gray-400 flex items-center gap-1"><MoveHorizontal size={10}/> Spacing</label>
                      <span className="text-[10px] text-gray-500 font-mono">{settings.letterSpacing || '-'}</span>
                  </div>
                  <input 
                      type="range" min="-0.1" max="0.5" step="0.01" 
                      value={settings.letterSpacing || 0} 
                      onChange={(e) => update('letterSpacing', e.target.value)}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
              </div>
          </div>
          <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                  <button onClick={() => update('textTransform', 'uppercase')} className={`p-1 rounded ${settings.textTransform === 'uppercase' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} title="Uppercase"><CaseUpper size={14}/></button>
                  <button onClick={() => update('textTransform', 'lowercase')} className={`p-1 rounded ${settings.textTransform === 'lowercase' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} title="Lowercase"><CaseLower size={14}/></button>
                  <button onClick={() => update('textTransform', 'none')} className={`p-1 rounded ${settings.textTransform === 'none' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} title="Normal">Aa</button>
              </div>
              <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-400">Color</label>
                  <input 
                      type="color" 
                      value={settings.color || '#000000'} 
                      onChange={(e) => update('color', e.target.value)}
                      className="w-6 h-6 rounded border-0 p-0 cursor-pointer"
                  />
              </div>
          </div>
      </div>
  );
};

export default TypographyControl;
