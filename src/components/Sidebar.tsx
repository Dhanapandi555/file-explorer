import React, { useState, useEffect } from 'react';
import { 
  Home, 
  HardDrive, 
  Download, 
  FileText, 
  Image, 
  Music, 
  Video,
  Folder,
  Star,
  Clock,
  Trash2
} from 'lucide-react';
import { SidebarItem, FileSystemItem } from '../types';
import { fileSystemAPI } from '../utils/fileSystem';

interface SidebarProps {
  selectedPath: string;
  onSelectPath: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPath, onSelectPath }) => {
  const [rootItems, setRootItems] = useState<FileSystemItem[]>([]);
  const rootPath = fileSystemAPI.getRootPath();

  // Load root directory items
  useEffect(() => {
    const loadRootItems = async () => {
      if (fileSystemAPI.hasAccess()) {
        const items = await fileSystemAPI.listDirectory(rootPath);
        setRootItems(items.filter(item => item.isDirectory));
      }
    };
    loadRootItems();
  }, [rootPath]);

  const favoriteItems: SidebarItem[] = rootItems.slice(0, 5).map(item => ({
    name: item.name,
    icon: 'folder',
    path: item.path,
    color: 'text-blue-400',
  }));

  const locationItems: SidebarItem[] = [
    { name: rootPath, icon: 'home', path: rootPath, color: 'text-gray-400' },
  ];

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      home: <Home size={16} />,
      file: <FileText size={16} />,
      download: <Download size={16} />,
      folder: <Folder size={16} />,
      image: <Image size={16} />,
      music: <Music size={16} />,
      video: <Video size={16} />,
      star: <Star size={16} />,
      clock: <Clock size={16} />,
      trash: <Trash2 size={16} />,
    };
    return iconMap[iconName] || <Folder size={16} />;
  };

  const renderSidebarItem = (item: SidebarItem) => (
    <button
      key={item.path}
      onClick={() => onSelectPath(item.path)}
      className={`
        w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
        transition-smooth hover:bg-mac-hover
        ${selectedPath === item.path ? 'bg-mac-selected text-white' : 'text-gray-300'}
      `}
    >
      <span className={item.color}>{getIcon(item.icon)}</span>
      <span className="truncate">{item.name}</span>
    </button>
  );

  return (
    <div className="w-48 bg-mac-sidebar border-r border-mac-border flex flex-col h-full overflow-y-auto">
      {/* Favorites Section */}
      {favoriteItems.length > 0 && (
        <div className="p-2">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
            Favorites
          </div>
          <div className="space-y-0.5">
            {favoriteItems.map(renderSidebarItem)}
          </div>
        </div>
      )}

      {/* Locations Section */}
      <div className="p-2">
        <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
          Location
        </div>
        <div className="space-y-0.5">
          {locationItems.map(renderSidebarItem)}
        </div>
      </div>

      {/* Tags Section */}
      <div className="p-2 mt-auto">
        <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
          Tags
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Red</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Orange</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Yellow</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Green</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Blue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
