import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import ListView from './components/ListView';
import IconView from './components/IconView';
import ColumnView from './components/ColumnView';
import GalleryView from './components/GalleryView';
import { FileSystemItem, ViewMode, SortBy, SortOrder } from './types';
import { fileSystemAPI } from './utils/fileSystem';

function App() {
  const [currentPath, setCurrentPath] = useState<string>('/Users/Dhandapani');
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FileSystemItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [history, setHistory] = useState<string[]>(['/Users/Dhandapani']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Load directory contents
  useEffect(() => {
    const loadDirectory = async () => {
      const directoryItems = await fileSystemAPI.listDirectory(currentPath);
      setItems(directoryItems);
      setSelectedItems(new Set());
    };
    loadDirectory();
  }, [currentPath]);

  // Filter and sort items
  useEffect(() => {
    let result = [...items];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort items
    result.sort((a, b) => {
      let comparison = 0;

      // Directories first
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = (a.modified?.getTime() || 0) - (b.modified?.getTime() || 0);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'kind':
          const kindA = fileSystemAPI.getFileKind(a);
          const kindB = fileSystemAPI.getFileKind(b);
          comparison = kindA.localeCompare(kindB);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(result);
  }, [items, searchQuery, sortBy, sortOrder]);

  const handleNavigate = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleSelectItem = (path: string, isMulti: boolean) => {
    if (isMulti) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(path)) {
        newSelected.delete(path);
      } else {
        newSelected.add(path);
      }
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(new Set([path]));
    }
  };

  const handleOpenItem = (item: FileSystemItem) => {
    if (item.isDirectory) {
      handleNavigate(item.path);
    } else {
      // In a real app, this would open the file
      console.log('Opening file:', item.path);
      alert(`Opening: ${item.name}\n\nIn a real application, this would open the file with the default application.`);
    }
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <ListView
            items={filteredItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onOpenItem={handleOpenItem}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        );
      case 'icons':
        return (
          <IconView
            items={filteredItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onOpenItem={handleOpenItem}
          />
        );
      case 'columns':
        return (
          <ColumnView
            items={filteredItems}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            items={filteredItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onOpenItem={handleOpenItem}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-mac-content font-sf-pro">
      {/* Toolbar */}
      <Toolbar
        currentPath={currentPath}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigateBack={handleNavigateBack}
        onNavigateForward={handleNavigateForward}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedPath={currentPath}
          onSelectPath={handleNavigate}
        />

        {/* Content Area */}
        <div className="flex-1 bg-mac-content overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-mac-sidebar border-t border-mac-border flex items-center justify-between px-4 text-xs text-gray-400">
        <div>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          {selectedItems.size > 0 && ` • ${selectedItems.size} selected`}
        </div>
        <div>
          {currentPath}
        </div>
      </div>
    </div>
  );
}

export default App;
