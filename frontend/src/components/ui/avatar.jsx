export function Avatar({
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}