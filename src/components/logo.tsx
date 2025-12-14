import darkLogo from "@/assets/logos/kiddiesTown/logo.png";
import logo from "@/assets/logos/kiddiesTown/logo.png";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
}

export function Logo({
  className,
  width,
  height,
  alt = "KiddiesTown logo"
}: LogoProps) {
  // Determine container styles
  const containerStyles: React.CSSProperties = {};

  if (width) {
    containerStyles.width = typeof width === 'number' ? `${width}px` : width;
  }

  if (height) {
    containerStyles.height = typeof height === 'number' ? `${height}px` : height;
  }

  // Only use default styles if width/height aren't provided
  const defaultClass = !width && !height ? "h-8 max-w-[15.847rem]" : "";
  
  return (
    <div
      className={`relative ${defaultClass} ${className || ""}`}
      style={containerStyles}
    >
      <Image
        src={logo}
        fill
        className="dark:hidden object-contain"
        alt={alt}
        role="presentation"
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block object-contain"
        alt={alt}
        role="presentation"
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}