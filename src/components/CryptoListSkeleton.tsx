const CryptoListSkeleton = () => {
  return (
    <div className="glass-card rounded-lg p-6 animate-pulse">
      <div className="h-6 w-48 bg-secondary rounded mb-6"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-secondary rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-secondary rounded"></div>
              <div className="h-3 w-16 bg-secondary rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoListSkeleton;