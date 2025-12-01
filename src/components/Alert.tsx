import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose, actions }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="text-green-400" />;
      case 'error':
        return <XCircle size={24} className="text-red-400" />;
      case 'warning':
        return <AlertCircle size={24} className="text-yellow-400" />;
      case 'info':
        return <Info size={24} className="text-blue-400" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-400/30';
      case 'error':
        return 'border-red-400/30';
      case 'warning':
        return 'border-yellow-400/30';
      case 'info':
        return 'border-blue-400/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className={`bg-mac-sidebar border ${getAccentColor()} rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn`}
        style={{
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-md hover:bg-mac-hover text-gray-400 hover:text-gray-200 transition-smooth"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  action.primary
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-mac-hover hover:bg-mac-border text-gray-200'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
