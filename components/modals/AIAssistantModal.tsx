
import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, FileText, Check, Palette, ToggleLeft, ToggleRight } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string, length: string, fileContent: string, styleVibe: string, customPalette?: string[]) => Promise<void>;
}

const STYLE_PRESETS = [
  { id: 'modern', label: 'Modern Minimal', color: '#000000', desc: 'Clean, simple, high contrast' },
  { id: 'corporate', label: 'Corporate', color: '#2563eb', desc: 'Professional, trustworthy blue' },
  { id: 'warm', label: 'Warm & Cozy', color: '#d97706', desc: 'Inviting, earth tones, serif' },
  { id: 'tech', label: 'Tech & Dark', color: '#7c3aed', desc: 'Futuristic, dark mode, neon' },
  { id: 'nature', label: 'Nature', color: '#059669', desc: 'Organic, green, fresh' },
  { id: 'luxury', label: 'Luxury', color: '#fbbf24', desc: 'Elegant, black & gold' }
];

const DEFAULT_PALETTE = ['#2563eb', '#4f46e5', '#111827', '#f3f4f6', '#1f2937'];
const PALETTE_LABELS = ['Primary', 'Secondary', 'Dark BG', 'Light BG', 'Text'];

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [styleVibe, setStyleVibe] = useState('modern');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [useCustomPalette, setUseCustomPalette] = useState(false);
  const [customPalette, setCustomPalette] = useState<string[]>(DEFAULT_PALETTE);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const updatePaletteColor = (index: number, color: string) => {
    const newPalette = [...customPalette];
    newPalette[index] = color;
    setCustomPalette(newPalette);
  };

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      await onGenerate(
          topic, 
          length, 
          fileContent, 
          styleVibe, 
          useCustomPalette ? customPalette : undefined
      );
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to generate site. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={isLoading ? undefined : onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2 text-blue-600">
            <Sparkles size={20} className="animate-pulse" />
            <h3 className="font-bold text-lg">AI Site Generator</h3>
          </div>
          {!isLoading && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Topic */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">What is this site about?</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
              placeholder="E.g., A minimalist portfolio for a landscape photographer based in Iceland..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Palette size={16} className="text-purple-500"/> Visual Style & Palette
                </label>
                <button 
                    onClick={() => setUseCustomPalette(!useCustomPalette)}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                    {useCustomPalette ? <ToggleRight size={20} className="text-blue-600" /> : <ToggleLeft size={20} />}
                    Custom Palette
                </button>
            </div>

            {useCustomPalette ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] text-gray-500 mb-3 uppercase font-bold tracking-wider">Define 5-Color Theme</p>
                    <div className="grid grid-cols-5 gap-2">
                        {customPalette.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm ring-1 ring-black/5 hover:ring-blue-400 transition-all cursor-pointer">
                                    <input 
                                        type="color" 
                                        value={color}
                                        onChange={(e) => updatePaletteColor(idx, e.target.value)}
                                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <span className="text-[9px] font-medium text-gray-600 text-center leading-tight">
                                    {PALETTE_LABELS[idx]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setStyleVibe(style.id)}
                      disabled={isLoading}
                      className={`border rounded-lg p-2 text-left transition-all flex items-center gap-3 ${
                        styleVibe === style.id
                          ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm border border-gray-100" style={{ backgroundColor: style.color }}></div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-800 truncate">{style.label}</div>
                        <div className="text-[10px] text-gray-500 truncate">{style.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
            )}
          </div>

          {/* Length */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Page Structure</label>
            <div className="grid grid-cols-3 gap-3">
              {(['short', 'medium', 'long'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setLength(opt)}
                  disabled={isLoading}
                  className={`border rounded-xl p-3 text-center transition-all ${
                    length === opt
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-xs font-bold uppercase mb-1">{opt}</div>
                  <div className="text-[10px] opacity-70">
                    {opt === 'short' ? '3-4 Sections' : opt === 'medium' ? '5-7 Sections' : '8+ Sections'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex justify-between">
              <span>Use Content from File</span>
              <span className="text-xs font-normal text-gray-400">Optional (.txt, .md)</span>
            </label>
            <div 
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors ${
                fileName ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-500'
              }`}
            >
              {fileName ? (
                <>
                  <FileText size={20} />
                  <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFileName(''); setFileContent(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="p-1 hover:bg-green-100 rounded-full ml-auto"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span className="text-sm">Upload text file</span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.md"
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 mt-auto">
          <button
            onClick={handleSubmit}
            disabled={!topic.trim() || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
              !topic.trim() || isLoading 
                ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Dreaming up your site...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Site</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
