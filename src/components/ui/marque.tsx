// Marquee component for smooth scrolling
export const Marquee = ({
  children,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerClasses = `marquee-container ${
    pauseOnHover ? "hover:cursor-pointer" : ""
  } ${className}`;
  const trackClasses = `marquee-track ${
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
  }`;

  return (
    <div className={containerClasses}>
      <div className={trackClasses}>{children}</div>
      <div className={trackClasses}>{children}</div>
    </div>
  );
};
