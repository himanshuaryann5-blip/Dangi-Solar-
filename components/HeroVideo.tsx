'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const videoId = 'HvKsMUNY8KA';
const fallbackImage =
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2200&q=88';

type YouTubePlayer = {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
};

type YouTubePlayerEvent = {
  data: number;
  target: YouTubePlayer;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: () => void;
        onAutoplayBlocked: () => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
  }
}

export default function HeroVideo() {
  const playerHost = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const initializePlayer = () => {
    if (!playerHost.current || !window.YT?.Player || player.current) return;

    player.current = new window.YT.Player(playerHost.current, {
      videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: videoId,
        controls: 0,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        iv_load_policy: 3,
        disablekb: 1,
      },
      events: {
        onReady: ({ target }) => {
          target.mute();
          target.playVideo();
        },
        onStateChange: ({ data }) => {
          if (data === window.YT?.PlayerState.PLAYING) setIsPlaying(true);
        },
        onError: () => setIsPlaying(false),
        onAutoplayBlocked: () => setIsPlaying(false),
      },
    });
  };

  useEffect(
    () => () => {
      player.current?.destroy();
      player.current = null;
    },
    [],
  );

  return (
    <div className="hero-video" aria-hidden="true">
      <div
        className={`hero-video-fallback${isPlaying ? ' is-playing' : ''}`}
        style={{ backgroundImage: `url("${fallbackImage}")` }}
      />
      <div className="hero-video-player">
        <div ref={playerHost} />
      </div>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
        onReady={initializePlayer}
      />
    </div>
  );
}
