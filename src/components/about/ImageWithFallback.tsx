import { useState } from "react";
import { motion } from "framer-motion";

interface ImageWithFallbackProps {
  storageUrl: string;
  alt: string;
  className?: string;
}

const ImageWithFallback = ({
  storageUrl,
  alt,
  className = "",
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cache busting with a timestamp
  const timestamp = useState(() => Date.now())[0];
  const cacheBustedUrl = `${storageUrl}?t=${timestamp}`;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
          <motion.div
            className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      )}

      {/* Image or Fallback */}
      {!error ? (
        <motion.img
          src={cacheBustedUrl}
          alt={alt}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            console.error("Image failed to load:", cacheBustedUrl);
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg"
        >
          <p className="text-muted-foreground text-sm">Image failed to load</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageWithFallback;
