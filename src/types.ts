export interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modified?: Date;
  kind?: string;
  children?: FileSystemItem[];
}

export interface SidebarItem {
  name: string;
  icon: string;
  path: string;
  color?: string;
}

export type ViewMode = 'icons' | 'list' | 'columns' | 'gallery';

export type SortBy = 'name' | 'date' | 'size' | 'kind';
export type SortOrder = 'asc' | 'desc';
