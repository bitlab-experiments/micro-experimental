import React from 'react';
import { DownloadIcon, ImageIcon } from './Icons';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  generatedText?: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, generatedText }) => {
    
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {title === 'Edited' && imageUrl && (
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition-colors duration-300"
                title="Download Edited Image"
            >
                <DownloadIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Download</span>
            </button>
        )}
      </div>
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex-grow flex justify-center items-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="text-center text-gray-500">
            <ImageIcon className="mx-auto h-16 w-16" />
            <p className="mt-2">{title === 'Original' ? 'No image uploaded' : 'Your edited image will appear here'}</p>
          </div>
        )}
      </div>
      {generatedText && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 italic">{generatedText}</p>
        </div>
      )}
    </div>
  );
};