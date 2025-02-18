const PoolsSkeleton = ({ variant }: { variant?: "single" }) => {
  return (
    <div
      className={`gap-4 w-full grid grid-cols-1  ${
        variant === "single"
          ? " lg:grid-cols-3 md:grid-cols-2"
          : "lg:grid-cols-1"
      }`}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-full h-56 rounded-lg p-4 bg-secondary/20 animate-pulse flex flex-col justify-between border"
        >
          {/* Top section */}
          <div>
            <div className="h-6 bg-secondary/30 rounded mb-4" />
            <div className="h-4 bg-secondary/30 rounded mb-2 w-3/4" />
            <div className="h-4 bg-secondary/30 rounded w-1/2" />
          </div>

          {/* Bottom button placeholder */}
          <div className="h-10 bg-secondary/30 rounded" />
        </div>
      ))}
    </div>
  );
};

export default PoolsSkeleton;
