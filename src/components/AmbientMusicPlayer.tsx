import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sliders,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Radio,
  X,
} from 'lucide-react';

export interface AmbientTrack {
  id: string;
  name: string;
  genre: string;
  chords: number[][]; // Frequencies in Hz
  tempoSec: number;
}

const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'lounge',
    name: 'Aether Lounge Ambient',
    genre: 'Chillhop / Lounge',
    // Cmaj7 -> Am7 -> Fmaj7 -> G7
    chords: [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
    tempoSec: 4.5,
  },
  {
    id: 'lofi',
    name: 'Lofi Shopping Breeze',
    genre: 'Smooth Lofi Beats',
    // Dm9 -> G13 -> Cmaj9 -> A7alt
    chords: [
      [293.66, 349.23, 440.00, 523.25], // Dm9
      [196.00, 246.94, 329.63, 440.00], // G13
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
      [220.00, 277.18, 329.63, 392.00], // A7
    ],
    tempoSec: 3.8,
  },
  {
    id: 'ocean',
    name: 'Oceanic Calm Spa',
    genre: 'Meditation / Ambient',
    // Deep drone pads
    chords: [
      [130.81, 196.00, 261.63, 329.63],
      [110.00, 164.81, 220.00, 261.63],
      [146.83, 220.00, 293.66, 370.00],
    ],
    tempoSec: 6.0,
  },
  {
    id: 'velvet',
    name: 'Velvet Jazz Study',
    genre: 'Warm E-Piano',
    chords: [
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 349.23],
      [196.00, 246.94, 293.66, 392.00],
      [261.63, 329.63, 392.00, 493.88],
    ],
    tempoSec: 4.0,
  },
];

export const AmbientMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AmbientTrack>(AMBIENT_TRACKS[0]);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const activeNodesRef = useRef<OscillatorNode[]>([]);

  // Initialize Web Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : volume;
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopCurrentChord = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // ignore
      }
    });
    activeNodesRef.current = [];
  };

  const playChord = (frequencies: number[], duration: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    stopCurrentChord();

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + i * 200, now);

      // Smooth envelope attack and release
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current!);

      osc.start(now);
      osc.stop(now + duration + 0.6);

      activeNodesRef.current.push(osc);
    });
  };

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      let index = 0;

      const scheduleNext = () => {
        const chord = selectedTrack.chords[index];
        setCurrentChordIndex(index);
        playChord(chord, selectedTrack.tempoSec);

        index = (index + 1) % selectedTrack.chords.length;
        timerRef.current = window.setTimeout(scheduleNext, selectedTrack.tempoSec * 1000);
      };

      scheduleNext();

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        stopCurrentChord();
      };
    } else {
      stopCurrentChord();
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [isPlaying, selectedTrack]);

  // Update Master Gain when Volume or Mute changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : volume;
      masterGainRef.current.gain.setTargetAtTime(
        targetGain,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!isPlaying) {
      initAudio();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative">
      {/* Compact Mini Music Button */}
      <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-full px-3 py-1.5 shadow-sm">
        <button
          onClick={togglePlay}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
            isPlaying
              ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse'
              : 'bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700'
          }`}
          title={isPlaying ? 'Pause Ambient Lounge Music' : 'Play Smooth Ambient Music'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <div className="hidden sm:flex flex-col cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-1.5">
            <Radio className={`w-3 h-3 ${isPlaying ? 'text-indigo-600 dark:text-indigo-400 animate-spin' : 'text-zinc-400'}`} />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[110px]">
              {selectedTrack.name}
            </span>
          </div>
          <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">
            {isPlaying ? '♪ Playing Smooth Beats' : 'Ambient Lounge Off'}
          </span>
        </div>

        {/* Animated Equalizer Waveform when playing */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3.5 px-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <span className="w-0.5 bg-indigo-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-indigo-600 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-purple-500 rounded-full animate-bounce h-2.5" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 bg-indigo-400 rounded-full animate-bounce h-3" style={{ animationDelay: '450ms' }} />
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-zinc-600 dark:text-zinc-400"
          title="Open Soundscape Controls"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Audio Player Popover */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Aether Ambient Soundscape
              </h4>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Track Selector */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Mood Track</p>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {AMBIENT_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedTrack(track);
                    if (!isPlaying) {
                      initAudio();
                      setIsPlaying(true);
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedTrack.id === track.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 font-bold text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-[9px] text-zinc-400 font-medium">{track.genre}</p>
                  </div>
                  {selectedTrack.id === track.id && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Control & Mute */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Master Volume</span>
              <span className="font-mono font-bold text-zinc-600 dark:text-zinc-300">
                {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
