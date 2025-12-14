import darkLogo from "@/assets/logos/kiddiesTown/logo.png";
import logo from "@/assets/logos/kiddiesTown/logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming you have cn utility

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

  return (
    <div 
      className={cn("relative", className)}
      style={containerStyles}
    >
      {/* Light mode logo */}
      <Image
        src={logo}
        fill
        className="dark:hidden object-contain"
        alt={alt}
        role="presentation"
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Dark mode logo */}
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