import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, Code } from 'lucide-react';
import { FileSystemItem } from '../types';
import { fileSystemAPI } from '../utils/fileSystem';

interface FilePreviewProps {
  file: FileSystemItem | null;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || file.isDirectory) {
      setContent(null);
      return;
    }

    const loadFile = async () => {
      setLoading(true);
      setError(null);

      try {
        const ext = fileSystemAPI.getFileExtension(file.name);
        
        // Image files
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) {
          const dataUrl = await fileSystemAPI.readFileAsDataURL(file.path);
          if (dataUrl) {
            setContent(dataUrl);
          } else {
            setError('Failed to load image');
          }
        }
        // Text/Code files
        else if (fileSystemAPI.isPreviewable(file.name)) {
          const text = await fileSystemAPI.readFileAsText(file.path);
          if (text !== null) {
            setContent(text);
          } else {
            setError('Failed to load file content');
          }
        }
        // PDF files
        else if (ext === 'pdf') {
          const fileObj = await fileSystemAPI.readFile(file.path);
          if (fileObj) {
            const url = URL.createObjectURL(fileObj);
            setContent(url);
          } else {
            setError('Failed to load PDF');
          }
        }
        else {
          setError('Preview not available for this file type');
        }
      } catch (err) {
        setError('Error loading file: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [file]);

  if (!file) return null;

  const ext = fileSystemAPI.getFileExtension(file.name);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
  const isText = fileSystemAPI.isPreviewable(file.name) && !isImage && ext !== 'pdf';
  const isPDF = ext === 'pdf';

  const handleDownload = async () => {
    const fileObj = await fileSystemAPI.readFile(file.path);
    if (fileObj) {
      const url = URL.createObjectURL(fileObj);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-mac-content rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-mac-border">
          <div className="flex items-center gap-3">
            {isImage && <ImageIcon size={20} className="text-purple-400" />}
            {isText && <Code size={20} className="text-green-400" />}
            {isPDF && <FileText size={20} className="text-red-400" />}
            <div>
              <h2 className="text-lg font-semibold text-gray-200">{file.name}</h2>
              <p className="text-sm text-gray-400">
                {fileSystemAPI.formatFileSize(file.size)} • {fileSystemAPI.getFileKind(file)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-md hover:bg-mac-hover text-gray-300 transition-smooth"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-mac-hover text-gray-300 transition-smooth"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading...</div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-red-400">{error}</div>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-smooth"
              >
                Download File
              </button>
            </div>
          )}

          {!loading && !error && content && (
            <>
              {isImage && (
                <div className="flex items-center justify-center">
                  <img
                    src={content}
                    alt={file.name}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              )}

              {isText && (
                <pre className="bg-mac-sidebar p-4 rounded-lg overflow-auto text-sm text-gray-300 font-mono">
                  <code>{content}</code>
                </pre>
              )}

              {isPDF && (
                <iframe
                  src={content}
                  className="w-full h-[70vh] rounded-lg"
                  title={file.name}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mac-border flex items-center justify-between text-sm text-gray-400">
          <div>
            Modified: {fileSystemAPI.formatDate(file.modified)}
          </div>
          <div>
            Press ESC to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
