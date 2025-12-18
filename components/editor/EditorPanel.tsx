
import React from 'react';
import { LandingPageConfig } from '../../types';
import ContentEditor from './ContentEditor';
import StyleEditor from './StyleEditor';

interface EditorPanelProps {
  activeSection: string;
  config: LandingPageConfig;
  setConfig: (value: LandingPageConfig | ((val: LandingPageConfig) => LandingPageConfig)) => void;
  blockIndex: number;
  activeTab: 'content' | 'style';
  setActiveTab: (tab: 'content' | 'style') => void;
  updateConfig: (section: string, key: string, value: any) => void;
  updateBlock: (id: string, key: string, value: any) => void;
  updateBlockItem: (blockId: string, index: number, key: string, value: any) => void;
  addBlockItem: (blockId: string) => void;
  removeBlockItem: (blockId: string, index: number) => void;
  addSingletonItem: (section: string) => void;
  removeSingletonItem: (section: string, index: number) => void;
  updateSingletonItem: (section: string, index: number, key: string, value: any) => void;
  handleImageUploadTrigger: (section: string, key: string, index?: number) => void;
  randomizeColors: () => void;
  randomizeSectionBackgrounds: () => void;
  removeSection: (id: string) => void;
  handleStyleUpdate: (sectionId: string, blockIndex: number, key: string, value: any) => void;
  handleLanguageToggle?: () => void;
  toggleTheme?: () => void;
  onResetBlock: (id: string) => void;
  onReorder: (sectionId: string, newIndex: number) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  activeSection,
  config,
  setConfig,
  blockIndex,
  activeTab,
  setActiveTab,
  updateConfig,
  updateBlock,
  updateBlockItem,
  addBlockItem,
  removeBlockItem,
  addSingletonItem,
  removeSingletonItem,
  updateSingletonItem,
  handleImageUploadTrigger,
  randomizeColors,
  randomizeSectionBackgrounds,
  removeSection,
  handleStyleUpdate,
  handleLanguageToggle,
  toggleTheme,
  onResetBlock,
}) => {
  
  // --- DATA RETRIEVAL ---
  const currentData = activeSection === 'global' 
      ? config 
      : activeSection.startsWith('block-') 
          ? config.contentBlocks.find(b => b.id === activeSection.replace('block-','')) 
          : config[activeSection as keyof LandingPageConfig];

  // --- SPECIAL HANDLER FOR GLOBAL SETTINGS ---
  const handleGlobalUpdate = (key: string, value: any) => {
      if (['primaryColor', 'secondaryColor', 'buttonTextColor', 'backgroundColor', 'surfaceColor', 'fontHeading', 'fontBody', 'theme'].includes(key)) {
          setConfig(prev => ({ ...prev, [key]: value }));
      }
      else if (key.startsWith('design.')) {
          const designKey = key.replace('design.', '');
          setConfig(prev => ({
              ...prev,
              design: {
                  ...prev.design,
                  [designKey]: value
              }
          }));
      }
      else {
           setConfig(prev => ({ ...prev, [key]: value }));
      }
  };

  const getSectionLabel = () => {
    if (activeSection === 'global') return 'Global Settings';
    if (activeSection === 'navbar') return 'Navigation Bar';
    if (activeSection === 'footer') return 'Footer Section';
    if (activeSection === 'hero') return 'Hero Header';
    if (activeSection.startsWith('block-')) {
        const block = config.contentBlocks.find(b => b.id === activeSection.replace('block-',''));
        return `Editing: ${block?.type.toUpperCase() || 'Dynamic Block'}`;
    }
    return `Editing: ${activeSection.toUpperCase()}`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* --- STATUS LABEL --- */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
              {getSectionLabel()}
          </h3>
          <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Selection Active</span>
          </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'content' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'style' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Style
        </button>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'content' ? (
          <ContentEditor
            sectionId={activeSection}
            // Fix: Cast currentData to any to bypass property access errors on the complex union type when activeSection check ensures type compatibility
            type={activeSection.startsWith('block-') ? ((currentData as any)?.type || '') : activeSection}
            data={currentData}
            onUpdate={(key, value) => {
                 if (activeSection === 'global') handleGlobalUpdate(key, value);
                 else if (activeSection.startsWith('block-')) updateBlock((currentData as any).id, key, value);
                 else updateConfig(activeSection, key, value);
            }}
            onItemUpdate={(index, key, value) => {
                 if (activeSection.startsWith('block-')) updateBlockItem((currentData as any).id, index, key, value);
                 else updateSingletonItem(activeSection, index, key, value);
            }}
            onItemAdd={() => {
                 if (activeSection.startsWith('block-')) addBlockItem((currentData as any).id);
                 else addSingletonItem(activeSection);
            }}
            onItemRemove={(index) => {
                 if (activeSection.startsWith('block-')) removeBlockItem((currentData as any).id, index);
                 else removeSingletonItem(activeSection, index);
            }}
            onImageUpload={(key, index) => handleImageUploadTrigger(activeSection, key, index)}
            // Global Actions passed for internal UI support
            onRandomizeColors={randomizeColors}
            onRandomizeBackgrounds={randomizeSectionBackgrounds}
            onRemoveSection={() => removeSection(activeSection)}
            onLanguageToggle={handleLanguageToggle}
            onToggleTheme={toggleTheme}
            onResetBlock={() => onResetBlock(activeSection)}
          />
        ) : (
          <StyleEditor
            sectionId={activeSection}
            data={currentData}
            blockIndex={blockIndex}
            onUpdate={(key, value) => {
                if (activeSection === 'global') {
                    handleGlobalUpdate(key, value);
                } else {
                    handleStyleUpdate(activeSection, blockIndex, key, value);
                }
            }}
            onImageUploadTrigger={handleImageUploadTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
