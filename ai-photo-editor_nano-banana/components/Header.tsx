import React from 'react';
import { BananaIcon, RefreshIcon } from './Icons';

interface HeaderProps {
    onReset: () => void;
    hasImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasImage }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <BananaIcon className="h-8 w-8 text-yellow-500" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              AI Photo Editor <span className="text-yellow-500">(Nano Banana)</span>
            </h1>
        </div>
        {hasImage && (
            <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 transition-colors duration-300"
                title="Start over with a new image"
            >
                <RefreshIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Reset</span>
            </button>
        )}
      </div>
    </header>
  );
};