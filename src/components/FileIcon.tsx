import React from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive,
  File,
  Code,
  FileJson
} from 'lucide-react';
import { FileSystemItem } from '../types';
import { fileSystemAPI } from '../utils/fileSystem';

interface FileIconProps {
  item: FileSystemItem;
  size?: number;
}

const FileIcon: React.FC<FileIconProps> = ({ item, size = 40 }) => {
  if (item.isDirectory) {
    return <Folder size={size} className="text-blue-400" />;
  }

  const ext = fileSystemAPI.getFileExtension(item.name);
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) {
    return <ImageIcon size={size} className="text-purple-400" />;
  }
  
  // Video files
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
    return <Video size={size} className="text-orange-400" />;
  }
  
  // Audio files
  if (['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(ext)) {
    return <Music size={size} className="text-pink-400" />;
  }
  
  // Archive files
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return <Archive size={size} className="text-yellow-400" />;
  }
  
  // Code files
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'sh'].includes(ext)) {
    return <Code size={size} className="text-green-400" />;
  }
  
  // JSON files
  if (['json', 'xml', 'yaml', 'yml'].includes(ext)) {
    return <FileJson size={size} className="text-cyan-400" />;
  }
  
  // Text files
  if (['txt', 'md', 'log'].includes(ext)) {
    return <FileText size={size} className="text-gray-400" />;
  }
  
  // Default file icon
  return <File size={size} className="text-gray-400" />;
};

export default FileIcon;
