import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  // Fix: Changed React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  // Fix: Changed React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Fix: Changed React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  // Fix: Changed React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-full max-w-2xl text-center">
        <label
          htmlFor="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`relative block w-full rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-sky-500 bg-sky-100' : 'border-gray-300 bg-white hover:border-sky-500 hover:bg-gray-50'}`}
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-4 block text-lg font-semibold text-gray-800">
            Click to upload or drag and drop an image
          </span>
          <span className="mt-1 block text-sm text-gray-500">
            PNG, JPG, GIF up to 10MB
          </span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};