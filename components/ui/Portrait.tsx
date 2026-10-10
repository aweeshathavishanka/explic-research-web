"use client";

import { useEffect, useRef, useState } from "react";

type PortraitProps = {
  src: string;
  name: string;
  width: number;
  height: number;
  /** CSS object-position for the crop; faces sit in the upper third by default. */
  position?: string;
};

function initials(name: string) {
  const words = name.replace(/^Dr\.\s*/, "").split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

/**
 * Remote portrait in a fixed 4:5 frame (no layout shift). Plain <img> keeps the
 * static export free of image-optimisation dependencies. If the image cannot
 * load, a monogram replaces it rather than a broken-image icon.
 */
export function Portrait({ src, name, width, height, position = "50% 30%" }: PortraitProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // The image may fail before hydration attaches onError; check once on mount.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-surface">
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-accent-surface" role="img" aria-label={`${name} (photo unavailable)`}>
          <span aria-hidden className="text-4xl font-medium text-accent-text">
            {initials(name)}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={`Portrait of ${name}`}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectPosition: position }}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      )}
    </div>
  );
}
