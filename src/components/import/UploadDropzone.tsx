"use client";

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onUseDemo: () => void;
  acceptedTypes?: string[];
}

export default function UploadDropzone({ 
  onFileSelect, 
  onUseDemo, 
  acceptedTypes = ['.csv', '.xlsx', '.xls'] 
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file) return 'Ingen fil vald';
    
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!acceptedTypes.includes(extension)) {
      return `Filtypen ${extension} stöds inte. Använd ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size === 0) return 'Filen är tom';
    if (file.size > 50 * 1024 * 1024) return 'Filen är för stor (max 50 MB)';
    
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
    onFileSelect(file);
  }, [onFileSelect]);

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

  return (
    <div className="w-full">
      {/* File Input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        /* Upload Zone */
                 <div
           className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
             isDragOver
               ? 'border-[var(--accent)] bg-[var(--accent-soft-bg)]'
               : 'border-[var(--ring)] hover:border-[var(--accent)]'
           }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
                     <Upload className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-4" />
           
           <h3 className="text-lg font-medium text-[var(--text)] mb-2">
             Dra & släpp er fil här
           </h3>
           
           <p className="text-[var(--text-muted)] mb-4">
             eller{' '}
             <button
               type="button"
               onClick={handleBrowseClick}
               className="text-[var(--accent)] hover:text-[var(--accent-strong)] font-medium"
             >
               välj fil
             </button>
           </p>
           
           <p className="text-sm text-[var(--text-muted)]">
             Stöder {acceptedTypes.join(', ')} upp till 50 MB
           </p>
        </div>
      ) : (
        /* Selected File Info */
                 <div className="border rounded-lg p-4 bg-[var(--muted)] border-[var(--ring)]">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               <FileText className="h-8 w-8 text-[var(--accent)]" />
               <div>
                 <h4 className="font-medium text-[var(--text)]">{selectedFile.name}</h4>
                 <p className="text-sm text-[var(--text-muted)]">
                   {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Okänd typ'}
                 </p>
               </div>
             </div>
             
             <div className="flex items-center space-x-2">
               <CheckCircle className="h-5 w-5 text-[var(--success)]" />
               <button
                 type="button"
                 onClick={handleRemoveFile}
                 className="text-[var(--text-muted)] hover:text-[var(--text)]"
               >
                 <X className="h-5 w-5" />
               </button>
             </div>
           </div>
         </div>
      )}

      {/* Error Display */}
             {error && (
         <div className="mt-4 p-3 bg-[var(--danger-soft-bg)] border border-[var(--danger-soft-ring)] rounded-lg flex items-center space-x-2">
           <AlertCircle className="h-5 w-5 text-[var(--danger)]" />
           <span className="text-[var(--danger-soft-fg)] text-sm">{error}</span>
         </div>
       )}

      {/* Demo Button */}
      <div className="mt-6 text-center">
                 <button
           type="button"
           onClick={onUseDemo}
           className="inline-flex items-center px-4 py-2 border border-[var(--ring)] rounded-md shadow-sm text-sm font-medium text-[var(--text)] bg-[var(--card)] hover:bg-[var(--neutral-soft-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
         >
           <FileText className="h-4 w-4 mr-2" />
           Prova demo-data
         </button>
      </div>
    </div>
  );
}
