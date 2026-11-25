import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface MediaArtworkProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  imgClassName?: string;
}

export const MediaArtwork: React.FC<MediaArtworkProps> = ({
  src,
  alt,
  title,
  className = '',
  imgClassName = '',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#3B586D] via-[#4E5E57] to-[#273135] p-6 text-center text-[#EAE4D9] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="mb-3 h-7 w-7 opacity-75" strokeWidth={1.5} />
        <span className="font-serif text-lg font-medium tracking-wide text-balance">
          {title}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[var(--bg-recessed)] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
};
