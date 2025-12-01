import React from 'react';
import { FileSystemItem } from '../types';
import FileIcon from './FileIcon';

interface IconViewProps {
  items: FileSystemItem[];
  selectedItems: Set<string>;
  onSelectItem: (path: string, isMulti: boolean) => void;
  onOpenItem: (item: FileSystemItem) => void;
}

const IconView: React.FC<IconViewProps> = ({
  items,
  selectedItems,
  onSelectItem,
  onOpenItem,
}) => {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {items.map((item) => (
          <div
            key={item.path}
            onClick={(e) => onSelectItem(item.path, e.metaKey || e.ctrlKey)}
            onDoubleClick={() => onOpenItem(item)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer
              transition-smooth group
              ${selectedItems.has(item.path) 
                ? 'bg-mac-selected' 
                : 'hover:bg-mac-hover'
              }
            `}
          >
            <div className="transform transition-transform group-hover:scale-110">
              <FileIcon item={item} size={48} />
            </div>
            <div className={`
              text-xs text-center break-words w-full px-1 py-0.5 rounded
              ${selectedItems.has(item.path) 
                ? 'bg-mac-selected text-white' 
                : 'text-gray-200'
              }
            `}>
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconView;
