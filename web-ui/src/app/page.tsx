'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Play, Loader2, FileAudio, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [voice, setVoice] = useState('af_heart');
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
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
    setProgress(0);
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
              setStatus(`Processing Chapter ${data.chapterIndex}/${data.totalChapters}: ${data.chapterTitle}`);
              setProgress(data.progress);

              if (data.processedCharacters && data.totalCharacters && startTime) {
                const elapsed = (Date.now() - startTime!) / 1000; // seconds
                if (elapsed > 5 && data.processedCharacters > 0) {
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
                setProgress(100);
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
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Kokoro Audiobook Generator
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            High-performance local TTS. Convert EPUBs or Text to Audiobooks with parallel processing.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all hover:shadow-xl">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" /> Configuration
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Input Mode Switch */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  onClick={() => setInputMode('file')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${inputMode === 'file' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${inputMode === 'text' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Text Input
                </button>
              </div>

              {/* Upload / Text Area */}
              {inputMode === 'file' ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                    ${file ? 'bg-green-50 border-green-400' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className={`p-4 rounded-full ${file ? 'bg-green-100' : 'bg-blue-50'}`}>
                      <Upload className={`w-8 h-8 ${file ? 'text-green-600' : 'text-blue-500'}`} />
                    </div>
                    {file ? (
                      <div>
                        <p className="font-semibold text-green-800">{file.name}</p>
                        <p className="text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">EPUB or TXT files supported</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                />
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voice Model</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="af_heart">af_heart (Default)</option>
                    <option value="af_sky">af_sky</option>
                    <option value="af_bella">af_bella</option>
                    <option value="af_nicole">af_nicole</option>
                    <option value="af_sarah">af_sarah</option>
                    <option value="am_adam">am_adam</option>
                    <option value="am_michael">am_michael</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Speed: {speed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                  />
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg w-full hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="format"
                      value="m4b"
                      checked={format === 'm4b'}
                      onChange={(e) => setFormat(e.target.value as 'm4b' | 'mp3')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-700">M4B (Audiobook)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg w-full hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="format"
                      value="mp3"
                      checked={format === 'mp3'}
                      onChange={(e) => setFormat(e.target.value as 'm4b' | 'mp3')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-700">MP3 (Flat)</span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              {!loading ? (
                <button
                  onClick={handleGenerate}
                  disabled={(inputMode === 'file' && !file) || (inputMode === 'text' && !textInput.trim())}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5
                    ${(inputMode === 'file' && !file) || (inputMode === 'text' && !textInput.trim())
                      ? 'bg-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-200'}
                  `}
                >
                  <Play className="w-5 h-5 fill-current" /> Start Generation
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
                  className="w-full py-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <Loader2 className="w-5 h-5 animate-spin" /> Stop Generation
                </button>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-indigo-500" /> Output Console
              </h2>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              {/* Progress Card */}
              <div className="bg-gray-900 rounded-xl p-6 mb-6 shadow-inner flex-1 flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="text-gray-400 text-xs font-mono uppercase">Status Log</span>
                    {estimatedTimeRemaining && (
                      <span className="text-green-400 text-xs font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ETA: {estimatedTimeRemaining}
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-sm space-y-2">
                    {error ? (
                      <p className="text-red-400">Error: {error}</p>
                    ) : status ? (
                      <p className="text-blue-300 typing-effect">{status}</p>
                    ) : (
                      <p className="text-gray-600 italic">Waiting for job...</p>
                    )}
                  </div>
                </div>

                {loading && (
                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Card */}
              {downloadUrl && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800">Ready for Download</h3>
                      <p className="text-xs text-green-600">Audiobook successfully generated</p>
                    </div>
                  </div>

                  <a
                    href={downloadUrl}
                    download
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
