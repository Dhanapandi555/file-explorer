import { FileSystemItem } from '../types';

// Store for directory handles - maps path to FileSystemDirectoryHandle
const directoryHandles = new Map<string, FileSystemDirectoryHandle>();
const fileHandles = new Map<string, FileSystemFileHandle>();

// Root directory handle
let rootDirectoryHandle: FileSystemDirectoryHandle | null = null;
let rootPath: string = '';

export const fileSystemAPI = {
  // Request access to a directory
  requestDirectoryAccess: async (): Promise<{ handle: FileSystemDirectoryHandle; path: string } | null> => {
    try {
      // Check if File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        throw new Error('File System Access API is not supported in your browser. Please use Chrome, Edge, or another Chromium-based browser.');
      }

      const handle = await (window as any).showDirectoryPicker({
        mode: 'read',
      });
      
      rootDirectoryHandle = handle;
      rootPath = handle.name;
      directoryHandles.clear();
      fileHandles.clear();
      directoryHandles.set(rootPath, handle);
      
      return { handle, path: rootPath };
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error requesting directory access:', error);
        throw error;
      }
      return null;
    }
  },

  // Get the root directory path
  getRootPath: (): string => {
    return rootPath || 'No folder selected';
  },

  // Check if we have access to file system
  hasAccess: (): boolean => {
    return rootDirectoryHandle !== null;
  },

  // Get directory handle from path
  getDirectoryHandle: async (path: string): Promise<FileSystemDirectoryHandle | null> => {
    if (!rootDirectoryHandle) return null;

    // If it's the root path, return root handle
    if (path === rootPath) {
      return rootDirectoryHandle;
    }

    // Check cache first
    if (directoryHandles.has(path)) {
      return directoryHandles.get(path)!;
    }

    // Navigate to the directory
    try {
      const relativePath = path.replace(rootPath + '/', '');
      const parts = relativePath.split('/').filter(Boolean);
      
      let currentHandle = rootDirectoryHandle;
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part);
      }
      
      directoryHandles.set(path, currentHandle);
      return currentHandle;
    } catch (error) {
      console.error('Error getting directory handle:', error);
      return null;
    }
  },

  // Get file handle from path
  getFileHandle: async (path: string): Promise<FileSystemFileHandle | null> => {
    try {
      // Check cache first
      if (fileHandles.has(path)) {
        return fileHandles.get(path)!;
      }

      const parentPath = path.substring(0, path.lastIndexOf('/'));
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      
      const dirHandle = await fileSystemAPI.getDirectoryHandle(parentPath);
      if (!dirHandle) return null;

      const fileHandle = await dirHandle.getFileHandle(fileName);
      fileHandles.set(path, fileHandle);
      return fileHandle;
    } catch (error) {
      console.error('Error getting file handle:', error);
      return null;
    }
  },

  // Read file content
  readFile: async (path: string): Promise<File | null> => {
    try {
      const fileHandle = await fileSystemAPI.getFileHandle(path);
      if (!fileHandle) return null;

      const file = await fileHandle.getFile();
      return file;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  },

  // Read file as text
  readFileAsText: async (path: string): Promise<string | null> => {
    try {
      const file = await fileSystemAPI.readFile(path);
      if (!file) return null;

      const text = await file.text();
      return text;
    } catch (error) {
      console.error('Error reading file as text:', error);
      return null;
    }
  },

  // Read file as data URL (for images, etc.)
  readFileAsDataURL: async (path: string): Promise<string | null> => {
    try {
      const file = await fileSystemAPI.readFile(path);
      if (!file) return null;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error reading file as data URL:', error);
      return null;
    }
  },

  // Check if file is previewable
  isPreviewable: (filename: string): boolean => {
    const ext = fileSystemAPI.getFileExtension(filename);
    const previewableExts = [
      // Text files
      'txt', 'md', 'json', 'xml', 'csv', 'log',
      // Code files
      'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'sass', 'less',
      'py', 'java', 'cpp', 'c', 'h', 'cs', 'php', 'rb', 'go', 'rs', 'sh',
      // Images
      'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp',
      // PDF
      'pdf',
    ];
    return previewableExts.includes(ext);
  },

  // Get MIME type
  getMimeType: (filename: string): string => {
    const ext = fileSystemAPI.getFileExtension(filename);
    const mimeMap: { [key: string]: string } = {
      'txt': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
    };
    return mimeMap[ext] || 'application/octet-stream';
  },

  // List files and directories in a given path
  listDirectory: async (path: string): Promise<FileSystemItem[]> => {
    try {
      const handle = await fileSystemAPI.getDirectoryHandle(path);
      if (!handle) return [];

      const items: FileSystemItem[] = [];

      for await (const entry of (handle as any).values()) {
        const isDirectory = entry.kind === 'directory';
        let size: number | undefined;
        let modified: Date | undefined;

        if (!isDirectory) {
          try {
            const file = await entry.getFile();
            size = file.size;
            modified = new Date(file.lastModified);
          } catch (error) {
            console.error('Error getting file info:', error);
          }
        } else {
          // For directories, the File System Access API doesn't provide modification dates
          // Set to current date as a placeholder
          modified = new Date();
        }

        items.push({
          name: entry.name,
          path: path === rootPath ? `${path}/${entry.name}` : `${path}/${entry.name}`,
          isDirectory,
          size,
          modified,
        });
      }

      return items;
    } catch (error) {
      console.error('Error listing directory:', error);
      return [];
    }
  },

  // Get file/directory info
  getItemInfo: async (path: string): Promise<FileSystemItem | null> => {
    try {
      const parentPath = path.substring(0, path.lastIndexOf('/'));
      const items = await fileSystemAPI.listDirectory(parentPath);
      return items.find(item => item.path === path) || null;
    } catch (error) {
      console.error('Error getting item info:', error);
      return null;
    }
  },

  // Format file size
  formatFileSize: (bytes?: number): string => {
    if (!bytes) return '--';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Format date
  formatDate: (date?: Date): string => {
    if (!date) return '--';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  },

  // Get file extension
  getFileExtension: (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  },

  // Get file kind/type
  getFileKind: (item: FileSystemItem): string => {
    if (item.isDirectory) return 'Folder';
    
    const ext = fileSystemAPI.getFileExtension(item.name);
    const kindMap: { [key: string]: string } = {
      'txt': 'Text Document',
      'pdf': 'PDF Document',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'xls': 'Excel Spreadsheet',
      'xlsx': 'Excel Spreadsheet',
      'ppt': 'PowerPoint Presentation',
      'pptx': 'PowerPoint Presentation',
      'jpg': 'JPEG Image',
      'jpeg': 'JPEG Image',
      'png': 'PNG Image',
      'gif': 'GIF Image',
      'svg': 'SVG Image',
      'webp': 'WebP Image',
      'bmp': 'BMP Image',
      'mp4': 'MP4 Video',
      'mov': 'QuickTime Movie',
      'avi': 'AVI Video',
      'mkv': 'MKV Video',
      'webm': 'WebM Video',
      'mp3': 'MP3 Audio',
      'wav': 'WAV Audio',
      'flac': 'FLAC Audio',
      'aac': 'AAC Audio',
      'm4a': 'M4A Audio',
      'zip': 'ZIP Archive',
      'rar': 'RAR Archive',
      'tar': 'TAR Archive',
      'gz': 'GZIP Archive',
      '7z': '7-Zip Archive',
      'js': 'JavaScript File',
      'ts': 'TypeScript File',
      'jsx': 'React Component',
      'tsx': 'React TypeScript Component',
      'html': 'HTML Document',
      'css': 'CSS Stylesheet',
      'json': 'JSON File',
      'md': 'Markdown Document',
      'py': 'Python Script',
      'java': 'Java Source',
      'cpp': 'C++ Source',
      'c': 'C Source',
      'sh': 'Shell Script',
      'go': 'Go Source',
      'rs': 'Rust Source',
      'rb': 'Ruby Script',
      'php': 'PHP Script',
    };
    
    return kindMap[ext] || (ext ? ext.toUpperCase() + ' File' : 'File');
  },
};
