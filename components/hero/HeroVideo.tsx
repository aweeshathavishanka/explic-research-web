"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type FallbackImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  source: string;
};

type HeroVideoProps = {
  /** Validated https URL, or null to show the fallback image. */
  src: string | null;
  poster?: string;
  label: string;
  caption: string;
  fallback: FallbackImage;
};

// Follows the media element: "playing" is set only by its `playing` event.
type Playback = "playing" | "paused" | "blocked";

/**
 * Starts playback and swallows the promise rejection, so a refused or
 * interrupted play() never surfaces as an unhandled error. An AbortError only
 * means a later pause() or load superseded this call.
 */
function tryPlay(video: HTMLVideoElement, onRefused: () => void) {
  video.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") return;
    onRefused();
  });
}

/**
 * Hero media (layer 3). One <video> element with two modes:
 * - Preview: muted, looping, starts on load (or waits for Play under reduced motion).
 * - Sound: started by a click or key press, plays once from 0:00 with audio,
 *   then returns to the muted loop.
 * Falls back to the research figure if the video URL is invalid or fails to load.
 */
export function HeroVideo({ src, poster, label, caption, fallback }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedOffscreen = useRef(false);
  const [failed, setFailed] = useState(src === null);
  const [sound, setSound] = useState(false);
  const [playback, setPlayback] = useState<Playback>("paused");
  const [announcement, setAnnouncement] = useState("");

  const playSilently = (video: HTMLVideoElement, fromStart: boolean) => {
    video.muted = true;
    video.loop = true;
    if (fromStart) video.currentTime = 0;
    setSound(false);
    tryPlay(video, () => setPlayback("blocked"));
  };

  // Must run inside the click handler: the user gesture is what permits audio.
  const playWithSound = (video: HTMLVideoElement) => {
    video.loop = false;
    video.currentTime = 0;
    video.muted = false;
    setSound(true);
    setAnnouncement("Playing from the start with sound.");
    tryPlay(video, () => {
      setAnnouncement("Sound could not be enabled.");
      playSilently(video, true);
    });
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (sound) {
      playSilently(video, false);
      setAnnouncement("Sound off.");
    } else {
      playWithSound(video);
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedOffscreen.current = false;
      if (!sound) video.muted = true;
      tryPlay(video, () => setPlayback("blocked"));
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Playback starts here rather than through autoPlay, so the reduced-motion
    // check runs before anything moves. Mute the element itself, not only the
    // attribute, before the first play() call.
    video.defaultMuted = true;
    video.muted = true;

    // The source may have failed before hydration attached onError.
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      setFailed(true);
      return;
    }

    // An endless loop is motion: under reduced motion, wait for an explicit Play.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tryPlay(video, () => setPlayback("blocked"));
    }

    // Pause the silent preview while it is scrolled out of view; resume on return.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused && video.muted) {
        pausedOffscreen.current = true;
        video.pause();
      } else if (entry.isIntersecting && pausedOffscreen.current) {
        pausedOffscreen.current = false;
        tryPlay(video, () => setPlayback("blocked"));
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (failed) {
    return (
      <>
        <div className="rounded-xl border border-line bg-surface p-2 sm:p-3">
          {/* Static export: plain <img>, sized to avoid layout shift. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fallback.src}
            width={fallback.width}
            height={fallback.height}
            alt={fallback.alt}
            decoding="async"
            className="h-auto w-full rounded-lg dark:brightness-[0.92]"
          />
        </div>
        <figcaption className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-muted">
          {fallback.caption} <span className="text-subtle">{fallback.source}</span>
        </figcaption>
      </>
    );
  }

  const stopped = playback === "paused" || playback === "blocked";

  return (
    <>
      {/* Before the frame: figcaption must stay the last child of the figure. */}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <div className="rounded-xl border border-line bg-surface p-2 sm:p-3">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-purple-heart-950">
          <video
            ref={videoRef}
            src={src ?? undefined}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            aria-label={label}
            className="absolute inset-0 size-full object-cover"
            onPlaying={() => setPlayback("playing")}
            onPause={(e) => {
              // Ignore the pause that precedes `ended`, and off-screen pauses.
              if (!e.currentTarget.ended && !pausedOffscreen.current) setPlayback("paused");
            }}
            onEnded={(e) => {
              // Audible playback finished: back to the silent loop from 0:00.
              playSilently(e.currentTarget, true);
              setAnnouncement("Video finished. Sound off.");
            }}
            onVolumeChange={(e) => {
              // Muted from outside this component (e.g. system media controls).
              if (sound && e.currentTarget.muted) {
                e.currentTarget.loop = true;
                setSound(false);
              }
            }}
            onError={() => setFailed(true)}
          />

          {/* The whole media surface is the sound control. */}
          <button
            type="button"
            onClick={toggleSound}
            className="group absolute inset-0 flex cursor-pointer items-end p-3 text-left focus-visible:[outline-offset:-3px] sm:p-4"
          >
            <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-bg pl-3 pr-3.5 text-[13px] font-medium text-fg transition-colors duration-200 group-hover:border-accent">
              {sound ? (
                <>
                  <Volume2 className="size-4 text-accent-text" strokeWidth={1.5} aria-hidden />
                  Sound on
                  <span className="border-l border-line pl-2 font-normal text-muted">Click to mute</span>
                </>
              ) : (
                <>
                  <VolumeX className="size-4 text-muted" strokeWidth={1.5} aria-hidden />
                  Click to play with sound
                  <span className="sr-only">(restarts the video)</span>
                </>
              )}
            </span>
          </button>

          {/* Sibling, not nested: pause and resume without changing the sound mode. */}
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={stopped ? "Play video" : "Pause video"}
            className={`absolute bottom-3 right-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 sm:bottom-4 sm:right-4 ${
              playback === "blocked"
                ? "border-accent bg-accent text-on-accent hover:bg-accent-strong"
                : "border-line bg-bg text-fg hover:border-accent hover:text-accent-text"
            }`}
          >
            {stopped ? (
              <Play className="size-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <Pause className="size-4" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-muted">{caption}</figcaption>
    </>
  );
}
