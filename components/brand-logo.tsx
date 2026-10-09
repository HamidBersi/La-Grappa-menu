type BrandLogoProps = {
  size?: number;
  className?: string;
  alt?: string;
};

export function BrandLogo({
  size = 52,
  className = "",
  alt = "La Grappa",
}: BrandLogoProps) {
  return (
    <img
      src="/logo-grappa-round.png?v=2"
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`rounded-full object-cover ring-1 ring-[#1B1E19]/15 [print-color-adjust:exact] [-webkit-print-color-adjust:exact] ${className}`}
    />
  );
}
