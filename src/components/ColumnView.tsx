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
      const pathParts = currentPath.split("/").filter(Boolean);
      const newColumns: FileSystemItem[][] = [];

      // Start from root
      let currentItems = await fileSystemAPI.listDirectory("/Users/Dhandapani");
      newColumns.push(currentItems);

      // Build each level
      for (let i = 0; i < pathParts.length; i++) {
        const partialPath = "/" + pathParts.slice(0, i + 1).join("/");
        const nextItems = await fileSystemAPI.listDirectory(partialPath);
        if (nextItems.length > 0) {
          newColumns.push(nextItems);
        }
      }

      setColumns(newColumns);
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
