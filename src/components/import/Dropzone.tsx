"use client";

import { useState, useCallback, useRef } from 'react';
import { useI18n } from "@/providers/I18nProvider";
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  onUseDemo: () => void;
  acceptedTypes?: string[];
}

export function Dropzone({ onFiles, onUseDemo, acceptedTypes = ['.csv', '.xlsx', '.xls'] }: DropzoneProps) {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file) return t('import.dropzone.noFileSelected');
    
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!acceptedTypes.includes(extension)) {
      return t('import.dropzone.unsupportedType').replace('{extension}', extension).replace('{formats}', acceptedTypes.join(', '));
    }
    
    if (file.size === 0) return t('import.dropzone.emptyFile');
    if (file.size > 50 * 1024 * 1024) return t('import.dropzone.fileTooLarge');
    
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSelectedFile(file);
    onFiles([file]);
  }, [onFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 text-lg">{selectedFile.name}</h4>
                <p className="text-sm text-green-700">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Dropzone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('import.dropzone.title')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('import.dropzone.subtitle')}
            </p>
            
            <button
              onClick={handleBrowseClick}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('import.dropzone.selectFile')}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>{t('import.dropzone.supportedFormats')} {acceptedTypes.join(', ')}</p>
            <p>{t('import.dropzone.maxFileSize')}</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Demo Button */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-gray-500 mb-3">
          <div className="w-px h-4 bg-gray-300"></div>
          <span className="text-sm">{t('import.dropzone.or')}</span>
          <div className="w-px h-4 bg-gray-300"></div>
        </div>
        
        <button
          onClick={onUseDemo}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {t('import.dropzone.tryDemo')}
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          {t('import.dropzone.demoHint')}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
