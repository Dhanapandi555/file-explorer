import React from 'react';
import { FileSystemItem } from '../types';
import { fileSystemAPI } from '../utils/fileSystem';

interface GalleryViewProps {
  items: FileSystemItem[];
  selectedItems: Set<string>;
  onSelectItem: (path: string, isMulti: boolean) => void;
  onOpenItem: (item: FileSystemItem) => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  selectedItems,
  onSelectItem,
  onOpenItem,
}) => {
  const isImageFile = (item: FileSystemItem): boolean => {
    const ext = fileSystemAPI.getFileExtension(item.name);
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
  };

  const isVideoFile = (item: FileSystemItem): boolean => {
    const ext = fileSystemAPI.getFileExtension(item.name);
    return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext);
  };

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => {
          const isMedia = isImageFile(item) || isVideoFile(item);
          
          return (
            <div
              key={item.path}
              onClick={(e) => onSelectItem(item.path, e.metaKey || e.ctrlKey)}
              onDoubleClick={() => onOpenItem(item)}
              className={`
                relative aspect-square rounded-lg overflow-hidden cursor-pointer
                transition-smooth group
                ${selectedItems.has(item.path) 
                  ? 'ring-4 ring-mac-selected' 
                  : 'hover:ring-2 hover:ring-gray-500'
                }
              `}
            >
              {/* Thumbnail */}
              <div className="w-full h-full bg-mac-content flex items-center justify-center">
                {isMedia ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <div className="text-6xl">
                      {isImageFile(item) ? '🖼️' : '🎬'}
                    </div>
                  </div>
                ) : item.isDirectory ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <div className="text-6xl">📁</div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center">
                    <div className="text-6xl">📄</div>
                  </div>
                )}
              </div>

              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-white text-sm font-medium truncate">
                    {item.name}
                  </div>
                  <div className="text-gray-300 text-xs mt-1">
                    {item.isDirectory 
                      ? 'Folder' 
                      : fileSystemAPI.formatFileSize(item.size)
                    }
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {selectedItems.has(item.path) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-mac-selected rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryView;
