import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function YouTubeEmbed({ url, title = 'YouTube video' }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractVideoId(url);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&controls=1&showinfo=0&iv_load_policy=3&fs=0&playsinline=1`;

  return (
    <div className="relative aspect-[9/16] w-full max-w-[320px] mx-auto bg-ink-900 rounded-2xl overflow-hidden border border-white/10">
      {!playing ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={() => setPlaying(true)}
              className="w-16 h-16 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Play className="w-7 h-7 text-ink-950 ml-1" />
            </button>
          </div>
        </>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
