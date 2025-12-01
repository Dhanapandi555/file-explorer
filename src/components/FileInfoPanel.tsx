import React from 'react';
import { X, Calendar, HardDrive, FileType } from 'lucide-react';
import { FileSystemItem } from '../types';
import { fileSystemAPI } from '../utils/fileSystem';
import FileIcon from './FileIcon';

interface FileInfoPanelProps {
  file: FileSystemItem | null;
  onClose: () => void;
}

const FileInfoPanel: React.FC<FileInfoPanelProps> = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <div className="w-80 bg-mac-sidebar border-l border-mac-border flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-mac-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200">Info</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-mac-hover text-gray-400 transition-smooth"
        >
          <X size={16} />
        </button>
      </div>

      {/* File Icon and Name */}
      <div className="p-6 border-b border-mac-border">
        <div className="flex flex-col items-center gap-3">
          <FileIcon item={file} size={64} />
          <div className="text-center">
            <div className="text-sm font-medium text-gray-200 break-words">
              {file.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {fileSystemAPI.getFileKind(file)}
            </div>
          </div>
        </div>
      </div>

      {/* File Details */}
      <div className="p-4 space-y-4">
        {/* Size */}
        {!file.isDirectory && (
          <div className="flex items-start gap-3">
            <HardDrive size={16} className="text-gray-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">Size</div>
              <div className="text-sm text-gray-200">
                {fileSystemAPI.formatFileSize(file.size)}
              </div>
              {file.size && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {file.size.toLocaleString()} bytes
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modified Date */}
        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Modified</div>
            <div className="text-sm text-gray-200">
              {fileSystemAPI.formatDate(file.modified)}
            </div>
            {file.modified && (
              <div className="text-xs text-gray-500 mt-0.5">
                {file.modified.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* File Type */}
        <div className="flex items-start gap-3">
          <FileType size={16} className="text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Type</div>
            <div className="text-sm text-gray-200">
              {fileSystemAPI.getFileKind(file)}
            </div>
            {!file.isDirectory && (
              <div className="text-xs text-gray-500 mt-0.5">
                .{fileSystemAPI.getFileExtension(file.name) || 'no extension'}
              </div>
            )}
          </div>
        </div>

        {/* Path */}
        <div className="flex items-start gap-3">
          <FileType size={16} className="text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Path</div>
            <div className="text-sm text-gray-200 break-all">
              {file.path}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Indicator */}
      {!file.isDirectory && fileSystemAPI.isPreviewable(file.name) && (
        <div className="p-4 border-t border-mac-border">
          <div className="text-xs text-gray-500 text-center">
            Double-click to preview this file
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInfoPanel;
