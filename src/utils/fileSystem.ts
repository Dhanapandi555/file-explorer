import { FileSystemItem } from '../types';

// This is a mock API that simulates file system access
// In a real application, you would use the File System Access API or Electron
export const fileSystemAPI = {
  // Get the user's home directory path
  getHomeDirectory: (): string => {
    return '/Users/Dhandapani';
  },

  // List files and directories in a given path
  listDirectory: async (path: string): Promise<FileSystemItem[]> => {
    try {
      // In a browser environment, we'll use the File System Access API
      // For now, we'll return mock data
      const mockData = await getMockFileSystem(path);
      return mockData;
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
      'mp4': 'MP4 Video',
      'mov': 'QuickTime Movie',
      'avi': 'AVI Video',
      'mp3': 'MP3 Audio',
      'wav': 'WAV Audio',
      'zip': 'ZIP Archive',
      'rar': 'RAR Archive',
      'tar': 'TAR Archive',
      'gz': 'GZIP Archive',
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
    };
    
    return kindMap[ext] || ext.toUpperCase() + ' File';
  },
};

// Mock file system data
async function getMockFileSystem(path: string): Promise<FileSystemItem[]> {
  const mockData: { [key: string]: FileSystemItem[] } = {
    '/Users/Dhandapani': [
      { name: 'Desktop', path: '/Users/Dhandapani/Desktop', isDirectory: true, modified: new Date('2024-11-28') },
      { name: 'Documents', path: '/Users/Dhandapani/Documents', isDirectory: true, modified: new Date('2024-11-25') },
      { name: 'Downloads', path: '/Users/Dhandapani/Downloads', isDirectory: true, modified: new Date('2024-11-30') },
      { name: 'Pictures', path: '/Users/Dhandapani/Pictures', isDirectory: true, modified: new Date('2024-11-20') },
      { name: 'Music', path: '/Users/Dhandapani/Music', isDirectory: true, modified: new Date('2024-11-15') },
      { name: 'Videos', path: '/Users/Dhandapani/Videos', isDirectory: true, modified: new Date('2024-11-10') },
      { name: 'Projects', path: '/Users/Dhandapani/Projects', isDirectory: true, modified: new Date('2024-12-01') },
    ],
    '/Users/Dhandapani/Desktop': [
      { name: 'Notes.txt', path: '/Users/Dhandapani/Desktop/Notes.txt', isDirectory: false, size: 2048, modified: new Date('2024-11-28') },
      { name: 'Screenshot.png', path: '/Users/Dhandapani/Desktop/Screenshot.png', isDirectory: false, size: 1024000, modified: new Date('2024-11-29') },
      { name: 'Work', path: '/Users/Dhandapani/Desktop/Work', isDirectory: true, modified: new Date('2024-11-27') },
    ],
    '/Users/Dhandapani/Documents': [
      { name: 'Resume.pdf', path: '/Users/Dhandapani/Documents/Resume.pdf', isDirectory: false, size: 512000, modified: new Date('2024-11-20') },
      { name: 'Contracts', path: '/Users/Dhandapani/Documents/Contracts', isDirectory: true, modified: new Date('2024-11-15') },
      { name: 'Invoices', path: '/Users/Dhandapani/Documents/Invoices', isDirectory: true, modified: new Date('2024-11-10') },
      { name: 'Report.docx', path: '/Users/Dhandapani/Documents/Report.docx', isDirectory: false, size: 256000, modified: new Date('2024-11-25') },
    ],
    '/Users/Dhandapani/Downloads': [
      { name: 'installer.dmg', path: '/Users/Dhandapani/Downloads/installer.dmg', isDirectory: false, size: 52428800, modified: new Date('2024-11-30') },
      { name: 'archive.zip', path: '/Users/Dhandapani/Downloads/archive.zip', isDirectory: false, size: 10485760, modified: new Date('2024-11-29') },
      { name: 'image.jpg', path: '/Users/Dhandapani/Downloads/image.jpg', isDirectory: false, size: 2097152, modified: new Date('2024-11-28') },
    ],
    '/Users/Dhandapani/Projects': [
      { name: 'file-explorer', path: '/Users/Dhandapani/Projects/file-explorer', isDirectory: true, modified: new Date('2024-12-01') },
      { name: 'website', path: '/Users/Dhandapani/Projects/website', isDirectory: true, modified: new Date('2024-11-20') },
      { name: 'mobile-app', path: '/Users/Dhandapani/Projects/mobile-app', isDirectory: true, modified: new Date('2024-11-15') },
    ],
    '/Users/Dhandapani/Projects/file-explorer': [
      { name: 'src', path: '/Users/Dhandapani/Projects/file-explorer/src', isDirectory: true, modified: new Date('2024-12-01') },
      { name: 'public', path: '/Users/Dhandapani/Projects/file-explorer/public', isDirectory: true, modified: new Date('2024-12-01') },
      { name: 'package.json', path: '/Users/Dhandapani/Projects/file-explorer/package.json', isDirectory: false, size: 1024, modified: new Date('2024-12-01') },
      { name: 'README.md', path: '/Users/Dhandapani/Projects/file-explorer/README.md', isDirectory: false, size: 512, modified: new Date('2024-12-01') },
    ],
  };

  return mockData[path] || [];
}
