import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { SparklesIcon, XCircleIcon } from './components/Icons';
import { editImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';

type OriginalImage = {
  file: File;
  url: string;
};

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage({ file, url: URL.createObjectURL(file) });
    setEditedImage(null);
    setError(null);
    setGeneratedText(null);
    setPrompt('');
  };

  const handleReset = () => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage.url);
    }
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setGeneratedText(null);
    setPrompt('');
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt || !originalImage) {
      setError('Please provide both an image and a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setGeneratedText(null);

    try {
      const imagePart = await fileToGenerativePart(originalImage.file);
      const result = await editImage(imagePart, prompt);
      
      setEditedImage(result.imageUrl);
      setGeneratedText(result.text);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImage]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header onReset={handleReset} hasImage={!!originalImage} />
      <main className="container mx-auto px-4 py-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <ImageDisplay title="Original" imageUrl={originalImage.url} />
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex flex-col justify-center items-center rounded-2xl z-10">
                    <Loader />
                    <p className="mt-4 text-lg font-medium text-sky-600 animate-pulse">
                      Nano Banana is thinking...
                    </p>
                  </div>
                )}
                <ImageDisplay title="Edited" imageUrl={editedImage} generatedText={generatedText} />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3">
                <XCircleIcon className="h-6 w-6" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., add a pair of sunglasses on the cat"
                className="w-full md:flex-1 bg-gray-50 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 text-gray-900 placeholder-gray-500 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>{isLoading ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;