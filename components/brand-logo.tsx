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
      src="/logo-grappa-round.png?v=4"
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`rounded-full object-cover [print-color-adjust:exact] [-webkit-print-color-adjust:exact] ${className}`}
    />
  );
}
