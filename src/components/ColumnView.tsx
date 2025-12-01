import React, { useState, useEffect } from "react";
import { FileSystemItem } from "../types";
import FileIcon from "./FileIcon";
import { fileSystemAPI } from "../utils/fileSystem";

interface ColumnViewProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const ColumnView: React.FC<ColumnViewProps> = ({ currentPath, onNavigate }) => {
  const [columns, setColumns] = useState<FileSystemItem[][]>([]);
  const [selectedInColumn, setSelectedInColumn] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    // Build column hierarchy based on current path
    const buildColumns = async () => {
      const rootPath = fileSystemAPI.getRootPath();
      if (!rootPath || rootPath === "No folder selected") return;

      const newColumns: FileSystemItem[][] = [];
      const selectedMap: { [key: number]: string } = {};

      // Always start with root directory content
      const rootItems = await fileSystemAPI.listDirectory(rootPath);
      newColumns.push(rootItems);

      // If current path is root, we're done
      if (currentPath === rootPath) {
        setColumns(newColumns);
        setSelectedInColumn({});
        return;
      }

      // Handle subdirectories
      // currentPath format: "Root/Sub/Sub2"
      // We want to load:
      // 1. Root content (already done)
      // 2. Root/Sub content
      // 3. Root/Sub/Sub2 content

      // Remove root from path to get parts
      const relativePath = currentPath.substring(rootPath.length + 1);
      const parts = relativePath.split("/").filter(Boolean);

      let currentBuildPath = rootPath;

      // Select the item in the previous column that corresponds to the current folder
      // For the root column (index 0), we need to select "Sub" if path is "Root/Sub"

      // We need to reconstruct the path step by step
      // If path is "Root/A/B"
      // Column 0: List "Root". Selected: "Root/A"
      // Column 1: List "Root/A". Selected: "Root/A/B"
      // Column 2: List "Root/A/B". Selected: (none, or file if selected)

      // Let's iterate through parts to build subsequent columns
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const nextPath = `${currentBuildPath}/${part}`;

        // Mark selection in current column
        // The item "nextPath" should be selected in the current column (newColumns.length - 1)
        selectedMap[newColumns.length - 1] = nextPath;

        // Load content for this folder (next column)
        const nextItems = await fileSystemAPI.listDirectory(nextPath);
        if (nextItems.length > 0 || i < parts.length) {
          newColumns.push(nextItems);
        }

        currentBuildPath = nextPath;
      }

      setColumns(newColumns);
      setSelectedInColumn(selectedMap);
    };

    buildColumns();
  }, [currentPath]);

  const handleSelectItem = async (
    item: FileSystemItem,
    columnIndex: number
  ) => {
    setSelectedInColumn({ ...selectedInColumn, [columnIndex]: item.path });

    if (item.isDirectory) {
      const children = await fileSystemAPI.listDirectory(item.path);
      const newColumns = columns.slice(0, columnIndex + 1);
      if (children.length > 0) {
        newColumns.push(children);
      }
      setColumns(newColumns);
    }
  };

  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.isDirectory) {
      onNavigate(item.path);
    }
  };

  return (
    <div className="flex h-full overflow-x-auto">
      {columns.map((columnItems, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-shrink-0 w-64 border-r border-mac-border overflow-y-auto"
        >
          {columnItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleSelectItem(item, columnIndex)}
              onDoubleClick={() => handleDoubleClick(item)}
              className={`
                flex items-center gap-3 px-4 py-2 cursor-pointer
                transition-smooth border-b border-mac-border/50
                ${
                  selectedInColumn[columnIndex] === item.path
                    ? "bg-mac-selected text-white"
                    : "hover:bg-mac-hover text-gray-200"
                }
              `}
            >
              <FileIcon item={item} size={20} />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{item.name}</div>
                {!item.isDirectory && (
                  <div className="text-xs text-gray-500 truncate">
                    {fileSystemAPI.formatFileSize(item.size)}
                  </div>
                )}
              </div>
              {item.isDirectory && <div className="text-gray-500">›</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ColumnView;
