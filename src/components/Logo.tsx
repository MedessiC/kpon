const Logo = ({ className = "", showByline = false }: { className?: string; showByline?: boolean }) => (
  <div className={`flex items-baseline gap-1 ${className}`}>
    <span className="font-extrabold text-2xl tracking-tight">
      <span className="text-primary">Kp</span>
      <span className="text-accent">o</span>
      <span className="text-primary">n</span>
    </span>
    {showByline && (
      <span className="text-xs text-muted-foreground font-medium ml-1">by MIDEESSI</span>
    )}
  </div>
);

export default Logo;
