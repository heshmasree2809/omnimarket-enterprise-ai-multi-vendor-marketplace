import React, { useState } from 'react';
import {
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Image as ImageIcon,
  Film,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { ProductVideoMedia } from '../types/marketplace';

interface ProductGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string;
  videoMedia?: ProductVideoMedia[];
  hasVideoShowcase?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title,
  videoUrl,
  videoMedia,
  hasVideoShowcase,
}) => {
  const [activeMediaType, setActiveMediaType] = useState<'photo' | 'video'>('photo');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const displayImages =
    images && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'];

  const videosList: ProductVideoMedia[] =
    videoMedia && videoMedia.length > 0
      ? videoMedia
      : videoUrl
      ? [
          {
            id: 'vid-default',
            url: videoUrl,
            title: 'Product HD Video Showcase',
            duration: '0:20',
            type: 'demo',
          },
        ]
      : [];

  const currentVideo = videosList[selectedVideoIndex];

  return (
    <div className="space-y-4">
      {/* Media Type Switcher Tabs (Photos vs Videos) */}
      <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 w-full">
          <button
            onClick={() => setActiveMediaType('photo')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMediaType === 'photo'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos ({displayImages.length})</span>
          </button>

          {videosList.length > 0 && (
            <button
              onClick={() => setActiveMediaType('video')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                activeMediaType === 'video'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Showcase ({videosList.length})</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}
        </div>
      </div>

      {/* PHOTO VIEW MODE */}
      {activeMediaType === 'photo' && (
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden group cursor-zoom-in shadow-sm">
            <img
              src={displayImages[selectedPhotoIndex]}
              alt={title}
              onClick={() => setIsZoomed(!isZoomed)}
              className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'group-hover:scale-105'
              }`}
            />

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-700 dark:text-zinc-200 shadow hover:text-indigo-600 transition-colors"
              title="Toggle Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {videosList.length > 0 && (
              <button
                onClick={() => setActiveMediaType('video')}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow hover:bg-indigo-600 transition-colors"
              >
                <Film className="w-3 h-3 text-indigo-400" />
                Watch Video Demo
              </button>
            )}
          </div>

          {/* Photos thumbnails */}
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPhotoIndex(idx);
                  setIsZoomed(false);
                }}
                className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                  selectedPhotoIndex === idx
                    ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-105'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${title} thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}

            {/* Video preview thumbnail link */}
            {videosList.length > 0 && (
              <button
                onClick={() => setActiveMediaType('video')}
                className="w-16 h-16 rounded-xl border-2 border-indigo-500/50 bg-indigo-950/80 text-white flex flex-col items-center justify-center shrink-0 hover:scale-105 transition-all relative overflow-hidden group"
              >
                <Play className="w-5 h-5 text-indigo-400 fill-indigo-400 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-bold uppercase mt-1">Video</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIDEO SHOWCASE VIEW MODE */}
      {activeMediaType === 'video' && currentVideo && (
        <div className="space-y-3">
          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-zinc-800 overflow-hidden shadow-xl group">
            <video
              key={currentVideo.url}
              src={currentVideo.url}
              autoPlay={isPlaying}
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Video Overlay Top Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {currentVideo.type === '360'
                  ? '360° Studio Showcase'
                  : currentVideo.type === 'unboxing'
                  ? 'Unboxing & Fit Test'
                  : 'HD Product Walkthrough'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/60 text-white font-mono text-[10px]">
                {currentVideo.duration || 'HD 1080p'}
              </span>
            </div>

            {/* Video Bottom Player Controls */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <span className="text-xs font-semibold text-white/90 truncate max-w-[180px]">
                  {currentVideo.title}
                </span>
              </div>

              <button
                onClick={() => {
                  const videoEl = document.querySelector('video');
                  if (videoEl) {
                    if (videoEl.requestFullscreen) videoEl.requestFullscreen();
                  }
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multiple Video Selection List */}
          {videosList.length > 1 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Available Video Reels</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {videosList.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideoIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                      selectedVideoIndex === idx
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 font-bold text-indigo-600 dark:text-indigo-400'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Play className="w-3.5 h-3.5 shrink-0 text-indigo-500 fill-indigo-500" />
                      <span className="truncate">{vid.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono shrink-0">{vid.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
