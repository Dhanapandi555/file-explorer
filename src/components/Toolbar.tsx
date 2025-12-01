import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid3x3, 
  List, 
  Columns, 
  Image as ImageIcon,
  Search,
  MoreHorizontal,
  Share2,
  Tag,
  FolderOpen
} from 'lucide-react';
import { ViewMode } from '../types';

interface ToolbarProps {
  currentPath: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNewFolder: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentPath,
  viewMode,
  onViewModeChange,
  onNavigateBack,
  onNavigateForward,
  canGoBack,
  canGoForward,
  searchQuery,
  onSearchChange,
  onSelectNewFolder,
}) => {
  const pathParts = currentPath.split('/').filter(Boolean);
  const displayPath = pathParts.length > 0 ? pathParts[pathParts.length - 1] : currentPath;

  return (
    <div 
    className="h-12 bg-mac-sidebar border-b border-mac-border flex items-center justify-between px-4 gap-4"
    >
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSelectNewFolder}
          className="p-1.5 rounded-md transition-smooth hover:bg-mac-hover text-gray-300"
          title="Change Folder"
        >
          <FolderOpen size={18} />
        </button>
        <button
          onClick={onNavigateBack}
          disabled={!canGoBack}
          className={`p-1.5 rounded-md transition-smooth ${
            canGoBack 
              ? 'hover:bg-mac-hover text-gray-300' 
              : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNavigateForward}
          disabled={!canGoForward}
          className={`p-1.5 rounded-md transition-smooth ${
            canGoForward 
              ? 'hover:bg-mac-hover text-gray-300' 
              : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Center Section - Path and Search */}
      <div className="flex-1 flex items-center gap-3">
        <div className="text-sm font-medium text-gray-200 min-w-0">
          <span className="truncate block">{displayPath}</span>
        </div>
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-mac-content border border-mac-border rounded-md pl-9 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Right Section - View Controls */}
      <div className="flex items-center gap-2">
        {/* View Mode Buttons */}
        <div className="flex items-center bg-mac-content rounded-md p-0.5">
          <button
            onClick={() => onViewModeChange('icons')}
            className={`p-1.5 rounded transition-smooth ${
              viewMode === 'icons' 
                ? 'bg-mac-hover text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Icon View"
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded transition-smooth ${
              viewMode === 'list' 
                ? 'bg-mac-hover text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="List View"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('columns')}
            className={`p-1.5 rounded transition-smooth ${
              viewMode === 'columns' 
                ? 'bg-mac-hover text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Column View"
          >
            <Columns size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('gallery')}
            className={`p-1.5 rounded transition-smooth ${
              viewMode === 'gallery' 
                ? 'bg-mac-hover text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Gallery View"
          >
            <ImageIcon size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <button className="p-1.5 rounded-md hover:bg-mac-hover text-gray-300 transition-smooth" title="Share">
          <Share2 size={16} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-mac-hover text-gray-300 transition-smooth" title="Tags">
          <Tag size={16} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-mac-hover text-gray-300 transition-smooth" title="More">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
