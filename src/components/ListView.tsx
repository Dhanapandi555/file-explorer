import React from 'react';
import { FileSystemItem, SortBy, SortOrder } from '../types';
import { fileSystemAPI } from '../utils/fileSystem';
import FileIcon from './FileIcon';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ListViewProps {
  items: FileSystemItem[];
  selectedItems: Set<string>;
  onSelectItem: (path: string, isMulti: boolean) => void;
  onOpenItem: (item: FileSystemItem) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (field: SortBy) => void;
}

const ListView: React.FC<ListViewProps> = ({
  items,
  selectedItems,
  onSelectItem,
  onOpenItem,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIcon = (field: SortBy) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center bg-mac-sidebar border-b border-mac-border text-xs font-medium text-gray-400 sticky top-0 z-10">
        <button
          onClick={() => onSort('name')}
          className="flex items-center gap-1 px-4 py-2 hover:bg-mac-hover transition-smooth flex-1"
        >
          Name {renderSortIcon('name')}
        </button>
        <button
          onClick={() => onSort('date')}
          className="flex items-center gap-1 px-4 py-2 hover:bg-mac-hover transition-smooth w-48"
        >
          Date Modified {renderSortIcon('date')}
        </button>
        <button
          onClick={() => onSort('size')}
          className="flex items-center gap-1 px-4 py-2 hover:bg-mac-hover transition-smooth w-32"
        >
          Size {renderSortIcon('size')}
        </button>
        <button
          onClick={() => onSort('kind')}
          className="flex items-center gap-1 px-4 py-2 hover:bg-mac-hover transition-smooth w-40"
        >
          Kind {renderSortIcon('kind')}
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.path}
            onClick={(e) => onSelectItem(item.path, e.metaKey || e.ctrlKey)}
            onDoubleClick={() => onOpenItem(item)}
            className={`
              flex items-center text-sm cursor-pointer transition-smooth
              border-b border-mac-border/50
              ${selectedItems.has(item.path) 
                ? 'bg-mac-selected text-white' 
                : 'hover:bg-mac-hover text-gray-200'
              }
            `}
          >
            <div className="flex items-center gap-3 px-4 py-2 flex-1 min-w-0">
              <FileIcon item={item} size={20} />
              <span className="truncate">{item.name}</span>
            </div>
            <div className="px-4 py-2 w-48 text-gray-400 truncate">
              {fileSystemAPI.formatDate(item.modified)}
            </div>
            <div className="px-4 py-2 w-32 text-gray-400">
              {item.isDirectory ? '--' : fileSystemAPI.formatFileSize(item.size)}
            </div>
            <div className="px-4 py-2 w-40 text-gray-400 truncate">
              {fileSystemAPI.getFileKind(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
