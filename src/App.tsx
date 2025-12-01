import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import ListView from "./components/ListView";
import IconView from "./components/IconView";
import ColumnView from "./components/ColumnView";
import GalleryView from "./components/GalleryView";
import FilePreview from "./components/FilePreview";
import FileInfoPanel from "./components/FileInfoPanel";
import Alert, { AlertType } from "./components/Alert";
import { FileSystemItem, ViewMode, SortBy, SortOrder } from "./types";
import { fileSystemAPI } from "./utils/fileSystem";
import { FolderOpen, Info } from "lucide-react";

interface AlertState {
  show: boolean;
  type: AlertType;
  title: string;
  message: string;
  actions?: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
}

function App() {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FileSystemItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<FileSystemItem | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [selectedFileForInfo, setSelectedFileForInfo] =
    useState<FileSystemItem | null>(null);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    actions?: AlertState["actions"]
  ) => {
    setAlert({ show: true, type, title, message, actions });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close preview
      if (e.key === "Escape" && previewFile) {
        setPreviewFile(null);
      }
      // I to toggle info panel
      if (e.key === "i" && !e.metaKey && !e.ctrlKey && selectedFileForInfo) {
        setShowInfoPanel(!showInfoPanel);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewFile, showInfoPanel, selectedFileForInfo]);

  // Load directory contents
  useEffect(() => {
    const loadDirectory = async () => {
      if (!currentPath) return;

      try {
        const directoryItems = await fileSystemAPI.listDirectory(currentPath);
        setItems(directoryItems);
        setSelectedItems(new Set());
      } catch (error) {
        console.error("Error loading directory:", error);
        showAlert(
          "error",
          "Cannot Access Folder",
          "This folder cannot be accessed. It may contain system files or you may not have permission to view it. Please select a different folder.",
          [
            { label: "Go Back", onClick: handleNavigateBack, primary: false },
            {
              label: "Select New Folder",
              onClick: handleSelectNewFolder,
              primary: true,
            },
          ]
        );
        setItems([]);
      }
    };
    loadDirectory();
  }, [currentPath]);

  // Filter and sort items
  useEffect(() => {
    let result = [...items];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((item) =>
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
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison =
            (a.modified?.getTime() || 0) - (b.modified?.getTime() || 0);
          break;
        case "size":
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case "kind":
          const kindA = fileSystemAPI.getFileKind(a);
          const kindB = fileSystemAPI.getFileKind(b);
          comparison = kindA.localeCompare(kindB);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
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
      // Update info panel with selected file
      const item = filteredItems.find((i) => i.path === path);
      if (item) {
        setSelectedFileForInfo(item);
      }
    }
  };

  const handleOpenItem = (item: FileSystemItem) => {
    if (item.isDirectory) {
      handleNavigate(item.path);
    } else {
      // Show file preview
      setPreviewFile(item);
    }
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleToggleInfo = (item: FileSystemItem) => {
    if (selectedFileForInfo?.path === item.path) {
      // If clicking the same item, toggle the panel
      setShowInfoPanel(!showInfoPanel);
    } else {
      // If clicking a different item, show panel and update selection
      setSelectedFileForInfo(item);
      setShowInfoPanel(true);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <ListView
            items={filteredItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onOpenItem={handleOpenItem}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onToggleInfo={handleToggleInfo}
          />
        );
      case "icons":
        return (
          <IconView
            items={filteredItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onOpenItem={handleOpenItem}
          />
        );
      case "columns":
        return (
          <ColumnView currentPath={currentPath} onNavigate={handleNavigate} />
        );
      case "gallery":
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

  const handleSelectNewFolder = async () => {
    try {
      const result = await fileSystemAPI.requestDirectoryAccess();
      if (result) {
        setCurrentPath(result.path);
        setHistory([result.path]);
        setHistoryIndex(0);
        setHasAccess(true);
        showAlert(
          "success",
          "Folder Selected",
          `Successfully opened "${result.path}"`
        );
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "";

      // Check if it's a system folder restriction
      if (
        errorMessage.includes("system") ||
        errorMessage.includes("permission")
      ) {
        showAlert(
          "warning",
          "System Folder Restricted",
          "This folder contains system files that browsers cannot access for security reasons. Please select a folder from your home directory like Documents, Downloads, Desktop, or Projects.",
          [
            {
              label: "Try Again",
              onClick: handleSelectNewFolder,
              primary: true,
            },
          ]
        );
      } else {
        showAlert(
          "error",
          "Error Selecting Folder",
          errorMessage || "Failed to select folder. Please try again."
        );
      }
    }
  };

  // If no access, show folder selection screen
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-mac-content font-sf-pro p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="mb-6">
              <FolderOpen size={80} className="mx-auto text-blue-400" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-200 mb-3">
              Welcome to File Explorer
            </h1>
            <p className="text-gray-400 mb-6">
              Select a folder to start browsing your files
            </p>
            <button
              onClick={handleSelectNewFolder}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-smooth text-lg"
            >
              Select Folder
            </button>
          </div>

          {/* Browser Limitations Notice */}
          <div className="bg-mac-sidebar border border-mac-border rounded-lg p-4 mt-8 max-w-lg mx-auto text-left">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              Browser Access Info
            </h3>
            <div className="text-xs text-gray-400 space-y-3">
              <p>
                For security reasons, browsers restrict access to system-level
                folders.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-green-400 font-medium block mb-1">
                    ✅ Accessible
                  </span>
                  <ul className="list-disc list-inside opacity-80 space-y-0.5">
                    <li>User folders (Documents, etc.)</li>
                    <li>Project directories</li>
                    <li>External drives</li>
                  </ul>
                </div>
                <div>
                  <span className="text-red-400 font-medium block mb-1">
                    ❌ Restricted
                  </span>
                  <ul className="list-disc list-inside opacity-80 space-y-0.5">
                    <li>System folders (/System)</li>
                    <li>Applications folder</li>
                    <li>Root directory (/)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Info */}
          <p className="text-xs text-gray-500 text-center mt-6">
            This app requires Chrome, Edge, or another Chromium-based browser
          </p>
        </div>
      </div>
    );
  }

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
        onSelectNewFolder={handleSelectNewFolder}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar selectedPath={currentPath} onSelectPath={handleNavigate} />

        {/* Content Area */}
        <div className="flex-1 bg-mac-content overflow-hidden">
          {renderContent()}
        </div>

        {/* File Info Panel */}
        {showInfoPanel && selectedFileForInfo && (
          <FileInfoPanel
            file={selectedFileForInfo}
            onClose={() => setShowInfoPanel(false)}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-mac-sidebar border-t border-mac-border flex items-center justify-between px-4 text-xs text-gray-400">
        <div>
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          {selectedItems.size > 0 && ` • ${selectedItems.size} selected`}
        </div>
        <div>{currentPath}</div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}

      {/* Alert */}
      {alert.show && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          actions={alert.actions}
          onClose={closeAlert}
        />
      )}
    </div>
  );
}

export default App;
