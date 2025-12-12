'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Play, Download, Loader2, FileAudio, FileText } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [voice, setVoice] = useState('af_heart');
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string | null>(null);

  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [format, setFormat] = useState<'m4b' | 'mp3'>('m4b');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setDownloadUrl(null);
      setStatus('File selected ready for generation.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const handleGenerate = async () => {
    if (inputMode === 'file' && !file) return;
    if (inputMode === 'text' && !textInput.trim()) return;

    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    setStatus('Initializing generation...');
    setStartTime(Date.now());
    setEstimatedTimeRemaining(null);

    const controller = new AbortController();
    setAbortController(controller);

    const formData = new FormData();
    if (inputMode === 'file' && file) {
      formData.append('file', file);
    } else {
      formData.append('text', textInput);
    }
    formData.append('voice', voice);
    formData.append('speed', speed.toString());
    formData.append('format', format);

    try {
      setStatus('Uploading and processing...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            if (data.type === 'progress') {
              setStatus(`Processing Chapter ${data.chapterIndex}/${data.totalChapters}: ${data.chapterTitle} (${data.progress}%)`);

              if (data.processedCharacters && data.totalCharacters && startTime) {
                const elapsed = (Date.now() - startTime) / 1000; // seconds
                if (elapsed > 5 && data.processedCharacters > 0) { // Wait a bit for stable speed
                  const charsPerSec = data.processedCharacters / elapsed;
                  const remainingChars = data.totalCharacters - data.processedCharacters;
                  const remainingSeconds = remainingChars / charsPerSec;

                  if (remainingSeconds > 60) {
                    setEstimatedTimeRemaining(`${Math.ceil(remainingSeconds / 60)} minutes remaining`);
                  } else {
                    setEstimatedTimeRemaining(`${Math.ceil(remainingSeconds)} seconds remaining`);
                  }
                }
              }
            } else if (data.type === 'status') {
              setStatus(data.message);
            } else if (data.type === 'result') {
              if (data.success) {
                setDownloadUrl(data.downloadUrl);
                setStatus('Generation complete!');
              } else {
                setError('Generation failed.');
                setStatus('Failed.');
              }
            } else if (data.type === 'error') {
              setError(data.error);
              setStatus('Error occurred.');
            }
          } catch (e) {
            console.error('Error parsing JSON chunk', e);
          }
        }
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request canceled');
        setStatus('Generation stopped by user.');
      } else {
        console.error(err);
        setError(err.message || 'An error occurred');
        setStatus('Error occurred.');
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Kokoro Audiobook Generator</h1>
          <p className="text-gray-500 mt-2">Generate M4B audiobooks from EPUB or Text files using local Kokoro TTS.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Input
            </h2>

            {/* Input Mode Tabs */}
            <div className="flex gap-4 mb-4 border-b border-gray-200">
              <button
                onClick={() => setInputMode('file')}
                className={`pb-2 px-1 font-medium transition-colors ${inputMode === 'file'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                File Upload
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`pb-2 px-1 font-medium transition-colors ${inputMode === 'text'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Text Input
              </button>
            </div>

            {/* File Upload */}
            {inputMode === 'file' && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                  ${file ? 'bg-green-50 border-green-400' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className={`w-8 h-8 ${file ? 'text-green-600' : 'text-gray-400'}`} />
                  {file ? (
                    <p className="font-medium text-green-700">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-600 font-medium">Drop EPUB or TXT file here</p>
                      <p className="text-sm text-gray-400">or click to select</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Text Input */}
            {inputMode === 'text' && (
              <div className="mb-6">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            )}

            {/* Voice Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="af_heart">af_heart (Default)</option>
                <option value="af_sky">af_sky</option>
                <option value="af_bella">af_bella</option>
                <option value="af_nicole">af_nicole</option>
                <option value="af_sarah">af_sarah</option>
                <option value="am_adam">am_adam</option>
                <option value="am_michael">am_michael</option>
                {/* Add more voices as needed */}
              </select>
            </div>

            {/* Speed Slider */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed: {speed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Output Format */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="m4b"
                    checked={format === 'm4b'}
                    onChange={(e) => setFormat(e.target.value as 'm4b' | 'mp3')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">M4B (Audiobook)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="mp3"
                    checked={format === 'mp3'}
                    onChange={(e) => setFormat(e.target.value as 'm4b' | 'mp3')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">MP3 (Audio)</span>
                </label>
              </div>
            </div>

            {/* Generate / Stop Button */}
            <div className="flex gap-4">
              {!loading ? (
                <button
                  onClick={handleGenerate}
                  disabled={(inputMode === 'file' && !file) || (inputMode === 'text' && !textInput.trim())}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all
                    ${(inputMode === 'file' && !file) || (inputMode === 'text' && !textInput.trim())
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'}
                  `}
                >
                  <Play className="w-5 h-5" /> Generate Audiobook
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (abortController) {
                      abortController.abort();
                      setAbortController(null);
                      setLoading(false);
                      setStatus('Generation stopped by user.');
                    }
                  }}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg"
                >
                  <Loader2 className="w-5 h-5 animate-spin" /> Stop Generation
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-indigo-600" /> Output
            </h2>

            {/* Status Log */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto mb-6 shadow-inner">
              <p className="opacity-50 text-xs mb-2">System Logs:</p>
              {estimatedTimeRemaining && <p className="text-blue-400 font-bold mb-2">&gt; ETA: {estimatedTimeRemaining}</p>}
              {status && <p>&gt; {status}</p>}
              {error && <p className="text-red-400">&gt; Error: {error}</p>}
              {!status && !error && <p className="text-gray-600 italic">Waiting for input...</p>}
            </div>

            {/* Result Area */}
            {downloadUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileAudio className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Audiobook Ready!</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
