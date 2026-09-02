import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Loader2, Check, Search } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  accent: 'American';
}

const VOICES: Voice[] = [
  { id: 'af_heart', name: 'Heart', gender: 'Female', accent: 'American' },
  { id: 'af_sky', name: 'Sky', gender: 'Female', accent: 'American' },
  { id: 'af_bella', name: 'Bella', gender: 'Female', accent: 'American' },
  { id: 'af_nicole', name: 'Nicole', gender: 'Female', accent: 'American' },
  { id: 'af_sarah', name: 'Sarah', gender: 'Female', accent: 'American' },
  { id: 'am_adam', name: 'Adam', gender: 'Male', accent: 'American' },
  { id: 'am_michael', name: 'Michael', gender: 'Male', accent: 'American' },
];

interface VoicePickerProps {
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
}

export function VoicePicker({ selectedVoice, onVoiceSelect }: VoicePickerProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation(); // Prevent selecting the voice when clicking play

    if (playingVoice === voiceId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingVoice(null);
      return;
    }

    // Stop current if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlayingVoice(null);
    setLoadingVoice(voiceId);

    try {
      const audio = new Audio(`/api/sample?voice=${voiceId}`);
      audioRef.current = audio;

      audio.onended = () => {
        if (audioRef.current === audio) {
          setPlayingVoice(null);
          setLoadingVoice(null);
        }
      };

      // In case it loads very fast or from cache
      audio.oncanplaythrough = () => {
        if (audioRef.current === audio) {
          setLoadingVoice(null);
          setPlayingVoice(voiceId);
          audio.play().catch(err => {
            console.error("Playback failed", err);
            if (audioRef.current === audio) {
              setPlayingVoice(null);
            }
          });
        }
      };

      audio.onerror = (e) => {
        console.error("Audio error", e);
        if (audioRef.current === audio) {
          setLoadingVoice(null);
          setPlayingVoice(null);
        }
      };

      // Trigger load explicitly (though new Audio() usually does it)
      // audio.load();

    } catch (err) {
      console.error(err);
      setLoadingVoice(null);
    }
  };

  const filteredVoices = VOICES.filter(voice => {
    const matchesGender = genderFilter === 'All' || voice.gender === genderFilter;
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          voice.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search voices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg">
        {(['All', 'Female', 'Male'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setGenderFilter(filter)}
            className={`
              flex-1 py-1.5 text-xs font-semibold rounded-md transition-all
              ${genderFilter === filter
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {filteredVoices.map((voice) => (
        <div
          key={voice.id}
          onClick={() => onVoiceSelect(voice.id)}
          className={`
            relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group
            ${selectedVoice === voice.id
              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
              : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
              ${voice.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}
            `}>
              {voice.id.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className={`font-medium ${selectedVoice === voice.id ? 'text-blue-900' : 'text-gray-900'}`}>
                {voice.name}
              </p>
              <p className="text-xs text-gray-500">
                {voice.accent} {voice.gender}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedVoice === voice.id && (
              <Check className="w-5 h-5 text-blue-600 mr-2" />
            )}

            <button
              onClick={(e) => handlePlay(e, voice.id)}
              className={`
                p-2 rounded-full transition-all
                ${playingVoice === voice.id || loadingVoice === voice.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }
              `}
              title="Play Sample"
            >
              {loadingVoice === voice.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : playingVoice === voice.id ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
