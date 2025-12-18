
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, LayoutTemplate, Menu, Eye, Code, ChevronRight, Plus, 
  Settings, Trash2, Globe, Shuffle, RefreshCw, X, AlignJustify, 
  RotateCcw, RotateCw, FileText, Folder, Save, Upload, FileJson, Package,
  Sparkles, GripVertical, MousePointer2, Move
} from 'lucide-react';
import JSZip from 'jszip';

import { LandingPageConfig, DEFAULT_CONFIG, ContentBlock, Theme, BlockItem, BorderRadius } from './types';
import { translateLandingPageConfig, generateFullPageConfig } from './services/geminiService';
import { generateHtml, generateWordPressTheme, generateCss, generateJs } from './services/exportService';
import { exportProjectToZip } from './utils/projectExport';

import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Gallery from './components/landing/Gallery';
import Testimonials from './components/landing/Testimonials';
import CTA from './components/landing/CTA';
import ContactForm from './components/landing/ContactForm';
import Footer from './components/landing/Footer';
import Timeline from './components/landing/Timeline';
import Team from './components/landing/Team';
import TwoColumnInfo from './components/landing/TwoColumnInfo';
import Steps from './components/landing/Steps';
import Process from './components/landing/Process';
import Manifesto from './components/landing/Manifesto';
import ValueProposition from './components/landing/ValueProposition';
import Philosophy from './components/landing/Philosophy';
import PullQuotes from './components/landing/PullQuotes';
import ContentBlockRenderer from './components/landing/ContentBlock';
import Ticker from './components/landing/Ticker';
import PreviewFrame from './components/PreviewFrame';
import { EditorPanel } from './components/editor/EditorPanel';
import { SidebarList } from './components/editor/SidebarList';
import AIAssistantModal from './components/modals/AIAssistantModal';

import { 
  PREFILLED_DATA, 
  AI_AVAILABLE_BLOCKS, 
  THEME_PRESETS,
  getSectionIcon
} from './constants';

interface SavedProject {
    id: string;
    name: string;
    date: string;
    thumbnail?: string;
    config: LandingPageConfig;
}

const setDeepValue = (obj: any, path: string, value: any): any => {
    if (!path.includes('.')) {
        return { ...obj, [path]: value };
    }
    const parts = path.split('.');
    const head = parts[0];
    const tail = parts.slice(1).join('.');
    return {
        ...obj,
        [head]: setDeepValue(obj[head] || {}, tail, value)
    };
};

function useHistory<T extends object>(initialState: T): [T, (value: T | ((val: T) => T)) => void, () => void, () => void, boolean, boolean] {
  const [state, setStateInternal] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setStateInternal((currentState) => {
      if (currentState.past.length === 0) return currentState;
      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setStateInternal((currentState) => {
      if (currentState.future.length === 0) return currentState;
      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);
      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setStateInternal((currentState) => {
      const resolvedState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(currentState.present) 
        : newState;
      if (resolvedState === currentState.present) return currentState;
      return {
        past: [...currentState.past, currentState.present],
        present: resolvedState,
        future: [],
      };
    });
  }, []);

  return [state.present, setState, undo, redo, canUndo, canRedo];
}

function App() {
  const [config, setConfig, undo, redo, canUndo, canRedo] = useHistory<LandingPageConfig>(DEFAULT_CONFIG);
  const [activeSection, setActiveSection] = useState<string>('global');
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [activeImageField, setActiveImageField] = useState<{section: string, index?: number, key: string} | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(300, Math.min(800, mouseMoveEvent.clientX));
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);
    
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectImportInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const saved = localStorage.getItem('landing-gen-projects');
      if (saved) {
          try {
              setSavedProjects(JSON.parse(saved));
          } catch (e) {
              console.error("Failed to load projects", e);
          }
      }
  }, []);

  useEffect(() => {
     if (!config.design) {
         setConfig(prev => ({
             ...prev,
             design: { animation: 'slide-up', buttonStyle: 'rounded', animationDuration: 'normal' }
         }));
     }
  }, [config.design, setConfig]);

  const handleReloadPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const saveProject = () => {
      const name = prompt("Enter project name:", config.navbar.logoText || "My Landing Page");
      if (!name) return;
      const newProject: SavedProject = { id: Date.now().toString(), name, date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), config: config };
      const updatedProjects = [newProject, ...savedProjects];
      setSavedProjects(updatedProjects);
      localStorage.setItem('landing-gen-projects', JSON.stringify(updatedProjects));
      alert("Project saved successfully!");
  };

  const loadProject = (project: SavedProject) => {
      if (window.confirm(`Load project "${project.name}"? Unsaved changes will be lost.`)) {
          setConfig(project.config);
          setShowProjectModal(false);
          handleReloadPreview();
      }
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this project?")) {
          const updatedProjects = savedProjects.filter(p => p.id !== id);
          setSavedProjects(updatedProjects);
          localStorage.setItem('landing-gen-projects', JSON.stringify(updatedProjects));
      }
  };

  const exportProjectJson = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `project-${config.navbar.logoText.replace(/\s+/g, '-').toLowerCase()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleExport = (format: 'html' | 'wp') => {
      if (format === 'html') {
          const html = generateHtml(config, true, currentLang);
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `landing-${config.navbar.logoText.replace(/\s+/g, '-').toLowerCase() || 'site'}.html`;
          a.click();
          URL.revokeObjectURL(url);
      }
      setShowExportModal(false);
  };

  const handleZipExport = async () => {
      await exportProjectToZip(config);
      setShowExportModal(false);
  };

  const handleImportProjectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if (json.hero && json.navbar) {
                  setConfig(json);
                  setShowProjectModal(false);
                  handleReloadPreview();
              } else { alert("Invalid project file."); }
          } catch (e) { alert("Error parsing JSON file."); }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  const handleAIGeneratedConfig = async (topic: string, length: string, fileContent: string, styleVibe: string, customPalette?: string[]) => {
      const newConfig = await generateFullPageConfig(topic, length, fileContent, styleVibe, customPalette);
      if (newConfig) {
          setConfig(newConfig);
          handleReloadPreview();
          alert("Website generated successfully!");
      } else { alert("Failed to generate configuration. Please try again."); }
  };

  const updateConfig = (section: string, key: string, value: any) => { 
      setConfig((prev: LandingPageConfig) => {
          const sectionData = prev[section as keyof LandingPageConfig];
          if (!sectionData) return prev;
          const updatedSectionData = setDeepValue(sectionData, key, value);
          return { ...prev, [section]: updatedSectionData };
      }); 
  };

  const updateNestedArray = (arrayName: 'contentBlocks', index: number, key: string, value: any) => { 
      setConfig((prev: LandingPageConfig) => { 
          const newArray = [...prev[arrayName]]; 
          newArray[index] = setDeepValue(newArray[index], key, value);
          return { ...prev, [arrayName]: newArray }; 
      }); 
  };

  const updateBlock = (id: string, key: string, value: any) => { 
      setConfig((prev: LandingPageConfig) => ({ 
          ...prev, 
          contentBlocks: prev.contentBlocks.map(b => b.id === id ? setDeepValue(b, key, value) : b) 
      })); 
  };

  const updateBlockItem = (blockId: string, index: number, key: string, value: any) => { 
      setConfig((prev: LandingPageConfig) => ({ 
          ...prev, 
          contentBlocks: prev.contentBlocks.map(b => { 
              if (b.id !== blockId) return b; 
              const newItems = [...(b.items || [])]; 
              newItems[index] = { ...newItems[index], [key]: value }; 
              return { ...b, items: newItems }; 
          }) 
      })); 
  };

  const removeBlockItem = (blockId: string, index: number) => { 
      setConfig((prev: LandingPageConfig) => ({ 
          ...prev, 
          contentBlocks: prev.contentBlocks.map(b => { 
              if (b.id !== blockId) return b; 
              const newItems = [...(b.items || [])]; 
              newItems.splice(index, 1); 
              return { ...b, items: newItems }; 
          }) 
      })); 
  };

  const addBlockItem = (blockId: string) => { 
      setConfig((prev: LandingPageConfig) => ({ 
          ...prev, 
          contentBlocks: prev.contentBlocks.map(b => { 
              if (b.id !== blockId) return b; 
              const items = b.items || [];
              let newItem: BlockItem = { title: 'New Item', description: 'Description' };
              if (b.type === 'features' || b.type === 'features-gradient') newItem = { title: 'Feature', description: 'Description', icon: 'Zap' };
              else if (b.type === 'gallery') newItem = { title: 'Image', url: 'https://placehold.co/600x400' };
              return { ...b, items: [...items, newItem] }; 
          }) 
      })); 
  };

  const updateSingletonItem = useCallback((section: string, index: number, key: string, value: any) => { 
    setConfig((prev: any) => { 
      const collectionKey = prev[section].links ? 'links' : 'items';
      const newItems = [...prev[section][collectionKey]]; 
      newItems[index] = { ...newItems[index], [key]: value }; 
      return { ...prev, [section]: { ...prev[section], [collectionKey]: newItems } }; 
    }); 
  }, []);

  const removeSingletonItem = useCallback((section: string, index: number) => { 
    setConfig((prev: any) => { 
      const collectionKey = prev[section].links ? 'links' : 'items';
      const newItems = [...prev[section][collectionKey]]; 
      newItems.splice(index, 1); 
      return { ...prev, [section]: { ...prev[section], [collectionKey]: newItems } }; 
    }); 
  }, []);

  const addSingletonItem = useCallback((section: string) => { 
      setConfig((prev: any) => { 
          const collectionKey = prev[section].links ? 'links' : 'items';
          let newItem: any = { title: 'New Item', description: 'Description' };
          if (section === 'navbar') newItem = { label: 'New Link', href: '#' };
          return { ...prev, [section]: { ...prev[section], [collectionKey]: [...(prev[section][collectionKey] || []), newItem] } }; 
      }); 
  }, []);

  const handleImageUploadTrigger = (section: string, key: string, index?: number) => { setActiveImageField({ section, key, index }); fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
      const file = e.target.files?.[0]; if (!file || !activeImageField) return; 
      const reader = new FileReader(); 
      reader.onloadend = () => { 
          const base64 = reader.result as string; 
          const { section, key, index } = activeImageField; 
          if (section.startsWith('block-')) { 
              const blockId = section.replace('block-', ''); 
              if (index !== undefined) updateBlockItem(blockId, index, key, base64); 
              else updateBlock(blockId, key, base64); 
          } else if (index !== undefined) updateSingletonItem(section, index, key, base64); 
          else updateConfig(section, key, base64); 
      }; 
      reader.readAsDataURL(file); e.target.value = ''; 
  };

  const randomizeColors = () => { 
      const colors = ['#2563eb', '#4f46e5', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2', '#7c3aed']; 
      const primary = colors[Math.floor(Math.random() * colors.length)]; 
      setConfig(prev => ({ ...prev, primaryColor: primary })); 
  };

  const randomizeSectionBackgrounds = () => { 
      const bgs = ['#ffffff', '#f8fafc', '#f3f4f6', '#f0f9ff', '#f5f3ff', '#fff1f2', '#fff7ed', '#f0fdf4']; 
      setConfig(prev => { 
          const next: any = { ...prev }; 
          ['navbar', 'hero', 'features', 'gallery', 'footer'].forEach(sec => { 
              if(next[sec]) next[sec] = { ...next[sec], backgroundColor: bgs[Math.floor(Math.random() * bgs.length)] }; 
          }); 
          if (next.contentBlocks) {
              next.contentBlocks = next.contentBlocks.map((b: any) => ({ ...b, backgroundColor: bgs[Math.floor(Math.random() * bgs.length)] }));
          }
          return next; 
      }); 
  };

  const handleSectionSelect = (id: string) => { setActiveSection(id); setActiveTab('content'); };
  
  // FIX: Updated removeSection to actually remove the ID from sectionOrder for all types
  const removeSection = (id: string) => { 
      const isDynamic = id.startsWith('block-');
      setConfig(prev => {
          const next = { ...prev };
          if (isDynamic) {
              const blockId = id.replace('block-', '');
              next.contentBlocks = prev.contentBlocks.filter(b => b.id !== blockId);
          } else {
              // Mark as hidden for static but also remove from flow to reflect in sidebar
              if ((next as any)[id]) (next as any)[id].show = false;
          }
          next.sectionOrder = prev.sectionOrder.filter(s => s !== id);
          return next;
      });
      setActiveSection('global'); 
  };

  const addNewBlock = (type: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const defaultData = PREFILLED_DATA[type] || {};
    const newBlock: ContentBlock = {
      id: newId,
      type: type.includes('-') ? type.split('-')[0] : type,
      title: defaultData.title || `New Block`,
      show: true,
      description: defaultData.description || "Description...",
      items: defaultData.items ? JSON.parse(JSON.stringify(defaultData.items)) : [],
      ...defaultData
    };
    setConfig((prev: LandingPageConfig) => ({ ...prev, contentBlocks: [...prev.contentBlocks, newBlock], sectionOrder: [...prev.sectionOrder, `block-${newId}`] }));
    setActiveSection(`block-${newId}`); setShowAddMenu(false);
  };

  const handleStyleUpdate = useCallback((sectionId: string, blockIndex: number, key: string, value: any) => {
      if (blockIndex !== undefined && blockIndex !== -1) { updateNestedArray('contentBlocks', blockIndex, key, value); }
      else { updateConfig(sectionId, key, value); }
  }, []);

  let currentBlockIndex = -1;
  if (activeSection.startsWith('block-')) {
      const blockId = activeSection.replace('block-', '');
      currentBlockIndex = config.contentBlocks.findIndex(b => b.id === blockId);
  }

  // --- THEME ENGINE ---
  // Injects CSS Variables into the preview iframe for real-time reactivity
  const GlobalStyles = () => (
      <style>{`
          :root {
              --primary-color: ${config.primaryColor};
              --secondary-color: ${config.secondaryColor};
              --bg-color: ${config.backgroundColor};
              --surface-color: ${config.surfaceColor};
              --text-button: ${config.buttonTextColor || '#ffffff'};
              --heading-font: "${config.fontHeading}", sans-serif;
              --body-font: "${config.fontBody}", sans-serif;
          }
          
          body {
              font-family: var(--body-font);
              background-color: var(--bg-color);
              scroll-behavior: ${config.scrollBehavior || 'smooth'};
          }
          
          h1, h2, h3, h4, h5, h6 {
              font-family: var(--heading-font);
          }

          ::-webkit-scrollbar { width: ${config.design?.scrollWidth || 10}px; }
          ::-webkit-scrollbar-track { background: ${config.theme === 'dark' ? '#1f2937' : '#f1f1f1'}; }
          ::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: ${config.design?.scrollRadius || 10}px; }
          ::-webkit-scrollbar-thumb:hover { background: var(--secondary-color); }
          ::selection { background: var(--primary-color); color: var(--text-button); }
      `}</style>
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans text-gray-900 overflow-hidden">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-20 sticky top-0 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                   <LayoutTemplate size={24} /> <span>LandingGen AI</span>
               </div>
               <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                   <button onClick={() => setViewMode('editor')} className={`p-1.5 rounded ${viewMode === 'editor' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}><Code size={18}/></button>
                   <button onClick={() => setViewMode('split')} className={`p-1.5 rounded ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}><AlignJustify size={18} className="rotate-90"/></button>
                   <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}><Eye size={18}/></button>
               </div>
               <button onClick={handleReloadPreview} className="p-2 rounded-lg bg-gray-100 hover:bg-white border border-gray-200"><RefreshCw size={18}/></button>
          </div>
          <div className="flex items-center gap-3">
               <div className="flex border-r border-gray-300 pr-2 gap-1">
                   <button onClick={undo} disabled={!canUndo} className={`p-2 rounded hover:bg-gray-100 ${!canUndo && 'opacity-30'}`}><RotateCcw size={18}/></button>
                   <button onClick={redo} disabled={!canRedo} className={`p-2 rounded hover:bg-gray-100 ${!canRedo && 'opacity-30'}`}><RotateCw size={18}/></button>
               </div>
               <button onClick={() => setShowAIModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow hover:shadow-lg transition-all"><Sparkles size={16}/> AI Assistant</button>
               <button onClick={() => setShowProjectModal(true)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium"><Folder size={16}/> Projects</button>
               <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black"><Download size={16}/> Export</button>
          </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
          {(viewMode === 'editor' || viewMode === 'split') && (
             <aside className="bg-white border-r border-gray-200 flex z-10 shadow-xl relative flex-shrink-0" style={{ width: viewMode === 'editor' ? '100%' : `${sidebarWidth}px` }}>
                <div className="w-16 flex flex-col items-center py-4 border-r border-gray-200 gap-2 overflow-y-auto hide-scrollbar bg-gray-50">
                    <button onClick={() => handleSectionSelect('global')} className={`p-3 rounded-xl transition-all ${activeSection === 'global' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-200'}`} title="Global Settings"><Settings size={20}/></button>
                    <div className="w-8 h-px bg-gray-200 my-1"></div>
                    <button onClick={() => handleSectionSelect('navbar')} className={`p-3 rounded-xl transition-all ${activeSection === 'navbar' ? 'bg-white text-blue-600 border border-blue-200' : 'text-gray-400 hover:bg-gray-200'}`} title="Navigation"><Globe size={20}/></button>
                    
                    {/* Draggable Sections List Component */}
                    <SidebarList 
                        sections={config.sectionOrder}
                        contentBlocks={config.contentBlocks}
                        activeSection={activeSection}
                        onSelect={handleSectionSelect}
                        onReorder={(newOrder) => setConfig(prev => ({ ...prev, sectionOrder: newOrder }))}
                    />
                    
                    <button onClick={() => handleSectionSelect('footer')} className={`p-3 rounded-xl transition-all ${activeSection === 'footer' ? 'bg-white text-blue-600 border border-blue-200' : 'text-gray-400 hover:bg-gray-200'}`} title="Footer"><Menu size={20}/></button>
                    
                    <div className="mt-auto pt-4 relative">
                        <button onClick={() => setShowAddMenu(!showAddMenu)} className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"><Plus size={20} /></button>
                        {showAddMenu && (
                             <div className="absolute left-16 bottom-4 bg-white shadow-2xl rounded-xl border border-gray-200 p-2 w-64 z-50 grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto">
                                 <h4 className="text-xs font-bold text-gray-500 uppercase px-2 py-1">Add Section</h4>
                                 {AI_AVAILABLE_BLOCKS.map(block => (
                                       <button key={block.id} onClick={() => addNewBlock(block.id)} className="text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-700 flex items-center justify-between">{block.label} <Plus size={14} className="text-gray-300"/></button>
                                 ))}
                             </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col relative">
                    <EditorPanel 
                        activeSection={activeSection} config={config} setConfig={setConfig} blockIndex={currentBlockIndex}
                        activeTab={activeTab} setActiveTab={setActiveTab} updateConfig={updateConfig} updateBlock={updateBlock} updateBlockItem={updateBlockItem} addBlockItem={addBlockItem} removeBlockItem={removeBlockItem} addSingletonItem={addSingletonItem} removeSingletonItem={removeSingletonItem} updateSingletonItem={updateSingletonItem} handleImageUploadTrigger={handleImageUploadTrigger} randomizeColors={randomizeColors} randomizeSectionBackgrounds={randomizeSectionBackgrounds} removeSection={removeSection} handleStyleUpdate={handleStyleUpdate} onResetBlock={()=>{}} onReorder={()=>{}}
                    />
                </div>
                {viewMode === 'split' && <div className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 z-50" onMouseDown={startResizing} />}
             </aside>
          )}
          
          {(viewMode === 'preview' || viewMode === 'split') && (
             <div ref={previewContainerRef} className="flex-1 bg-gray-100 overflow-hidden relative">
                <PreviewFrame key={previewKey}>
                  <GlobalStyles />
                  <div 
                    id="canvas-root"
                    className={`bg-white shadow-2xl mx-auto transition-all duration-500 ease-out min-h-screen ${viewMode === 'split' ? 'max-w-[1000px] scale-[0.95] mt-4 mb-4' : 'max-w-full'}`} 
                    style={{ 
                        fontFamily: 'var(--body-font)',
                        '--primary-color': config.primaryColor,
                        '--secondary-color': config.secondaryColor,
                        '--bg-color': config.backgroundColor,
                        '--heading-font': config.fontHeading,
                    } as any}
                  >
                      <Navbar 
                        data={{...config.navbar}} 
                        theme={config.theme} 
                        primaryColor={config.primaryColor} 
                        fontHeading={config.fontHeading} 
                        currentLang={currentLang} 
                        isActive={activeSection === 'navbar'}
                        onSelect={() => handleSectionSelect('navbar')}
                      />
                      {config.sectionOrder.map((sectionId) => {
                          const commonProps = { 
                              theme: config.theme, 
                              primaryColor: config.primaryColor, 
                              secondaryColor: config.secondaryColor, 
                              fontHeading: config.fontHeading, 
                              fontBody: config.fontBody, 
                              borderRadius: config.borderRadius, 
                              enableAnimations: config.enableAnimations, 
                              design: config.design,
                              isActive: activeSection === sectionId,
                              onSelect: () => handleSectionSelect(sectionId) 
                          };

                          if (sectionId === 'hero') return <Hero key="hero" id="hero" data={config.hero} buttonTextColor={config.buttonTextColor} {...commonProps} />;
                          
                          if (sectionId.startsWith('block-')) {
                               const blockId = sectionId.replace('block-', '');
                               const block = config.contentBlocks.find(b => b.id === blockId);
                               if(!block) return null;
                               
                               switch (block.type) {
                                   case 'hero': return <Hero key={blockId} data={block as any} buttonTextColor={config.buttonTextColor} {...commonProps} />;
                                   case 'features': return <Features key={blockId} data={block as any} {...commonProps} />;
                                   case 'gallery': return <Gallery key={blockId} data={block as any} {...commonProps} />;
                                   case 'testimonials': return <Testimonials key={blockId} data={block as any} {...commonProps} />;
                                   case 'cta': return <CTA key={blockId} data={block as any} buttonTextColor={config.buttonTextColor} {...commonProps} />;
                                   case 'contactForm': return <ContactForm key={blockId} data={block as any} {...commonProps} />;
                                   case 'ticker': return <Ticker key={blockId} data={block} fontBody={config.fontBody} />;
                                   default: return <ContentBlockRenderer key={blockId} data={block} id={sectionId} {...commonProps} />;
                               }
                          }
                          if (sectionId === 'features') return <Features key="features" id="features" data={config.features} {...commonProps} />;
                          if (sectionId === 'gallery') return <Gallery key="gallery" id="gallery" data={config.gallery} {...commonProps} />;
                          if (sectionId === 'testimonials') return <Testimonials key="testimonials" id="testimonials" data={config.testimonials} {...commonProps} />;
                          return null;
                      })}
                      <Footer 
                        data={config.footer} 
                        theme={config.theme} 
                        fontHeading={config.fontHeading} 
                        fontBody={config.fontBody} 
                        secondaryColor={config.secondaryColor} 
                        enableAnimations={config.enableAnimations} 
                        design={config.design} 
                        isActive={activeSection === 'footer'}
                        onSelect={() => handleSectionSelect('footer')} 
                      />
                  </div>
                </PreviewFrame>
             </div>
          )}
      </main>
      <AIAssistantModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerate={handleAIGeneratedConfig} />
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col">
               <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                   <div><h3 className="text-2xl font-bold text-gray-800">My Projects</h3><p className="text-gray-500 text-sm">Manage your saved landing pages</p></div>
                   <button onClick={() => setShowProjectModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
               </div>
               <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-3">
                   {savedProjects.length === 0 && <div className="text-center py-12 text-gray-400"><Folder size={48} className="mx-auto mb-3 opacity-20"/><p>No saved projects yet.</p></div>}
                   {savedProjects.map((project) => (
                       <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-white group cursor-pointer" onClick={() => loadProject(project)}>
                           <div className="flex items-center gap-4"><div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">{project.name.charAt(0).toUpperCase()}</div><div><div className="font-bold text-gray-800 text-lg group-hover:text-blue-600">{project.name}</div><div className="text-xs text-gray-400">{project.date}</div></div></div>
                           <div className="opacity-0 group-hover:opacity-100"><button onClick={(e) => deleteProject(project.id, e)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={20} /></button></div>
                       </div>
                   ))}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                   <button onClick={saveProject} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"><Save size={18} /> Save Current</button>
                   <button onClick={() => projectImportInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold border"><Upload size={18} /> Import JSON</button>
                   <input type="file" ref={projectImportInputRef} onChange={handleImportProjectFile} accept=".json" className="hidden" />
               </div>
           </div>
        </div>
      )}
      {showExportModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Export Website</h3><button onClick={() => setShowExportModal(false)}><X size={20}/></button></div>
                  <div className="space-y-3">
                      <button onClick={() => handleExport('html')} className="w-full p-4 border rounded-xl hover:bg-blue-50 text-left font-bold">HTML/CSS Bundle</button>
                      <button onClick={handleZipExport} className="w-full p-4 border rounded-xl hover:bg-purple-50 text-left font-bold">Project ZIP with Assets</button>
                      <button onClick={exportProjectJson} className="w-full p-4 border rounded-xl hover:bg-green-50 text-left font-bold">Download Config JSON</button>
                  </div>
              </div>
          </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
}

export default App;
