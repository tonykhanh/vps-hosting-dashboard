
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, File as FileIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../../Button';

interface UploadFileModalProps {
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles) {
      setIsUploading(true);
      // Simulate network delay
      setTimeout(() => {
        onUpload(selectedFiles);
        onClose();
      }, 1500);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Upload size={20} className="text-plasma-600"/> Upload Files
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        {!selectedFiles ? (
          <div 
            className={`
              border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all
              ${isDragging 
                ? 'border-plasma-500 bg-plasma-50 dark:bg-plasma-900/20' 
                : 'border-gray-300 dark:border-neutral-700 hover:border-plasma-400 hover:bg-gray-50 dark:hover:bg-neutral-800'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               multiple 
               onChange={handleFileSelect}
             />
             <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Upload size={28} />
             </div>
             <p className="text-sm font-bold text-gray-900 dark:text-white">Click or drag files to upload</p>
             <p className="text-xs text-gray-500 mt-1">Maximum file size 5GB</p>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 border border-gray-100 dark:border-neutral-700">
                {Array.from(selectedFiles).map((file: File, idx) => (
                   <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-neutral-700 last:border-0">
                      <FileIcon size={18} className="text-gray-400" />
                      <div className="flex-1 min-w-0">
                         <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</div>
                         <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                      {isUploading && <Loader2 size={16} className="text-plasma-600 animate-spin" />}
                   </div>
                ))}
             </div>
             
             <div className="flex justify-end">
                <button onClick={() => setSelectedFiles(null)} className="text-xs text-red-500 hover:underline">Clear selection</button>
             </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isUploading} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedFiles || isUploading} className="flex-1 shadow-lg shadow-plasma-500/20">
             {isUploading ? 'Uploading...' : 'Start Upload'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
