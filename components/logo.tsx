"use client";
import LogoImage from "@/assets/logo_transparent.png";
import { AnimatedDiv } from "@/components/motion";
import NextLink from "next/link";
import Image from "next/image";

export const Logo: React.FC = () => {
  return (
    <NextLink className="flex justify-start items-center gap-1" href="/">
      <AnimatedDiv>
        <Image
          src={LogoImage.src}
          width={200}
          height={200}
          alt="PixelAI"
          className="justify-start mt-2"
        />
      </AnimatedDiv>
    </NextLink>
  );
};

export default Logo;
