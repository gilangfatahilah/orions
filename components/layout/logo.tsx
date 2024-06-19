'use client'
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  imgClass: string;
  size: number;
}

const Logo = ({imgClass, size}: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>('/logo/logo-clear.svg');

  useEffect(() => {
    const resolveTheme = theme === 'system' ? resolvedTheme : theme;

    if (resolveTheme === 'dark') {
      setLogoSrc('/logo/logo-clear.svg');
    } else {
      setLogoSrc('/logo/logo-dark.svg');
    }
  }, [theme, resolvedTheme]);

  return (
    <Image src={logoSrc} alt={'orion-logo'} width={size} height={size} className={imgClass} />
  )
}

export default Logo