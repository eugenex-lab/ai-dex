
import { useState } from "react";

interface ImageWithFallbackProps {
  storageUrl: string;
  alt: string;
  className?: string;
}

const ImageWithFallback = ({ storageUrl, alt, className = "" }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const timestamp = useState(() => Date.now())[0];
  const cacheBustedUrl = `${storageUrl}?t=${timestamp}`;

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {!error ? (
        <img
          src={cacheBustedUrl}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            console.error('Image failed to load:', cacheBustedUrl);
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg">
          <p className="text-muted-foreground text-sm">Image failed to load</p>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
