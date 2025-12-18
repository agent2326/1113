
import React, { useState, useEffect } from 'react';
import { LayoutTemplate } from 'lucide-react';
import { getSectionIcon } from '../../constants';

interface SidebarListProps {
    sections: string[];
    contentBlocks: any[];
    activeSection: string;
    onSelect: (id: string) => void;
    onReorder: (newOrder: string[]) => void;
}

export const SidebarList: React.FC<SidebarListProps> = ({ 
    sections, contentBlocks, activeSection, onSelect, onReorder 
}) => {
    // Local state for fluid drag-and-drop interactions
    const [items, setItems] = useState<string[]>(sections);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    // FIX: Synchronize local state with props immediately when the source list changes (e.g., deletion)
    useEffect(() => {
        setItems(sections);
    }, [sections]);

    const onDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Set drag image if needed, or use default
    };

    const onDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) return;
        // Keep hero at the top if desired, or allow movement
        if (targetId === 'hero' || draggedId === 'hero') return;

        const currentOrder = [...items];
        const sourceIndex = currentOrder.indexOf(draggedId);
        const targetIndex = currentOrder.indexOf(targetId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
            currentOrder.splice(sourceIndex, 1);
            currentOrder.splice(targetIndex, 0, draggedId);
            setItems(currentOrder);
            onReorder(currentOrder); // Push updates back to the global application state
        }
    };

    const onDragEnd = () => {
        setDraggedId(null);
    };

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            {items.map((sectionId) => {
                 // Hero is a special static section usually locked at the top
                 if (sectionId === 'hero') return (
                     <button 
                        key="hero" 
                        onClick={() => onSelect('hero')} 
                        className={`p-3 rounded-xl transition-all ${activeSection === 'hero' ? 'bg-white text-blue-600 border border-blue-200 shadow-sm' : 'text-gray-400 hover:bg-gray-200'}`}
                        title="Hero Section"
                     >
                        <LayoutTemplate size={20}/>
                     </button>
                 );

                 const block = sectionId.startsWith('block-') ? contentBlocks.find(b => b.id === sectionId.replace('block-','')) : null;
                 const type = block ? block.type : sectionId;
                 const Icon = getSectionIcon(sectionId, type);
                 
                 return (
                     <div 
                        key={sectionId}
                        draggable
                        onDragStart={(e) => onDragStart(e, sectionId)}
                        onDragOver={(e) => onDragOver(e, sectionId)}
                        onDragEnd={onDragEnd}
                        className={`relative group transition-all duration-200 ${draggedId === sectionId ? 'opacity-50 scale-95' : 'opacity-100'}`}
                     >
                        {/* Drag handle visual indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300 opacity-0 group-hover:opacity-100 cursor-move rounded-r"></div>
                        <button 
                            onClick={() => onSelect(sectionId)} 
                            className={`p-3 rounded-xl transition-all ${activeSection === sectionId ? 'bg-white text-blue-600 border border-blue-200 shadow-sm' : 'text-gray-400 hover:bg-gray-200'}`} 
                            title={type}
                        >
                            <Icon size={20}/>
                        </button>
                     </div>
                 );
            })}
        </div>
    );
};

export default SidebarList;
