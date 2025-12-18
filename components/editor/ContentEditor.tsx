import React, { useState } from 'react';
import { Plus, Trash2, Upload, ChevronDown, ChevronRight, Image as ImageIcon, Film, Shuffle, RotateCcw, Trash, Globe, Moon, Sun } from 'lucide-react';

interface ContentEditorProps {
    sectionId: string;
    type: string;
    data: any;
    collectionName?: string;
    onUpdate: (key: string, value: any) => void;
    onImageUpload: (key: string, index?: number) => void;
    onItemAdd: () => void;
    onItemRemove: (index: number) => void;
    onItemUpdate: (index: number, key: string, value: any) => void;
    // New Action Props
    onRandomizeColors?: () => void;
    onRandomizeBackgrounds?: () => void;
    onRemoveSection?: () => void;
    onLanguageToggle?: () => void;
    onToggleTheme?: () => void;
    onResetBlock?: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
    sectionId, 
    type, 
    data, 
    collectionName = 'items', 
    onUpdate, 
    onImageUpload, 
    onItemAdd, 
    onItemRemove, 
    onItemUpdate,
    onRandomizeColors,
    onRandomizeBackgrounds,
    onRemoveSection,
    onLanguageToggle,
    onToggleTheme,
    onResetBlock
}) => {
    const [isContentOpen, setIsContentOpen] = useState(true);

    if (!data) return <div className="p-4 text-gray-500 text-center">Select a section to edit</div>;

    const renderField = (key: string, value: any, onChange: (val: any) => void) => {
        if (key === 'id' || key === 'show') return null;
        
        const isLongText = ['description', 'bio', 'content', 'message', 'quote', 'text'].includes(key);
        const label = key.replace(/([A-Z])/g, ' $1').trim();

        return (
            <div key={key} className="mb-3">
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">{label}</label>
                {isLongText ? (
                    <textarea 
                        className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none min-h-[80px]" 
                        rows={3} 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)} 
                    />
                ) : (
                    <input 
                        className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none" 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)} 
                    />
                )}
            </div>
        );
    };

    const isImageKey = (key: string) => ['image', 'image2', 'image3', 'image4', 'avatar', 'icon', 'url', 'backgroundImage'].includes(key);
    const isMainContentKey = (key: string) => !isImageKey(key) && key !== 'show' && key !== 'type' && !Array.isArray(data[key]) && typeof data[key] !== 'object' && !key.toLowerCase().includes('typography');

    const renderMediaSlot = (slotIndex: number, key: string, label: string) => {
        const value = data[key];
        return (
            <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-all shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-mono">{slotIndex}</span>
                        {label}
                    </span>
                </div>
                <div className="flex gap-2">
                    <input 
                        placeholder="URL..."
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-[11px] bg-gray-50 focus:bg-white outline-none"
                        value={value || ''}
                        onChange={(e) => onUpdate(key, e.target.value)}
                    />
                    <button onClick={() => onImageUpload(key)} className="p-1.5 bg-blue-50 text-blue-600 rounded"><Upload size={14}/></button>
                </div>
            </div>
        );
    };

    const listItems = data[collectionName] || data.items || [];
    const showMediaGrid = ['hero', 'gallery', 'features', 'twoColumnInfo'].includes(type);

    return (
        <div className="space-y-6 pb-10">
            {/* Global Quick Actions Area */}
            {sectionId === 'global' && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button onClick={onRandomizeColors} className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors border border-blue-100">
                        <Shuffle size={14}/> Randomize Palette
                    </button>
                    <button onClick={onToggleTheme} className="flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors border border-gray-200">
                        <Moon size={14}/> Toggle Mode
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setIsContentOpen(!isContentOpen)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-100"
                >
                    <span className="font-bold text-gray-700 text-sm">Main Content</span>
                    {isContentOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                </button>
                
                {isContentOpen && (
                    <div className="p-4 space-y-1">
                        {Object.keys(data).map(key => isMainContentKey(key) ? renderField(key, data[key], (val) => onUpdate(key, val)) : null)}
                    </div>
                )}
            </div>

            {showMediaGrid && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2"><ImageIcon size={16}/> Media Assets</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {renderMediaSlot(1, 'image', 'Primary')}
                        {renderMediaSlot(2, 'image2', 'Secondary')}
                    </div>
                </div>
            )}

            {Array.isArray(listItems) && listItems.length > 0 && (
                <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-sm">{collectionName === 'links' ? 'Navigation' : 'Items'}</h3>
                        <button onClick={onItemAdd} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                            <Plus size={14}/> Add New
                        </button>
                    </div>
                    <div className="space-y-3">
                        {listItems.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white border border-gray-200 p-3 rounded-xl relative group shadow-sm hover:border-blue-400 transition-all">
                                <button onClick={() => onItemRemove(idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><Trash2 size={14}/></button>
                                <div className="space-y-2 pr-6">
                                    {Object.keys(item).map(k => (
                                        <div key={k}>
                                            <label className="text-[10px] text-gray-400 uppercase font-bold">{k}</label>
                                            <input className="w-full border border-gray-100 p-1 rounded text-sm bg-gray-50" value={item[k] || ''} onChange={e => onItemUpdate(idx, k, e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section Actions Footer */}
            {sectionId !== 'global' && (
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Section Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={onResetBlock} className="flex items-center justify-center gap-2 p-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold hover:bg-orange-100 transition-all">
                            <RotateCcw size={14}/> Reset Data
                        </button>
                        <button onClick={onRemoveSection} className="flex items-center justify-center gap-2 p-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
                            <Trash size={14}/> Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ContentEditor;