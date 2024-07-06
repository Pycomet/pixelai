"use client";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import { ThemeSwitch } from "../theme-switch";
import { AnimatedDiv } from "@/components/motion";
import { Image } from "@nextui-org/react";
import BGImage from "@/assets/stock1.jpg";
import Logo from "../logo";

interface PageLayoutProps {
  showNav: boolean;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  showNav,
  children,
}) => {
  // TODO: Add A Preloader To Make Page Transitions Easier

  return (
    <section>
      {showNav ? (
        <>
          <Navbar />
          <main className="container mx-auto max-w-8xl pt-6 lg:pt-16 px-6 flex-grow">
            {children}
          </main>
          <footer className="w-full flex flex-row items-center justify-center md:justify-start py-3 px-6">
            <Link
              isExternal
              className="flex items-center gap-1 text-sm cursor-pointer"
              href={siteConfig.links.github}
              title="Codefred's Github"
            >
              <span className="text-default-600">Built by</span>
              <p className="text-primary">Codefred</p>
            </Link>
          </footer>
        </>
      ) : (
        <main className="mx-auto max-h-screen w-full flex-grow">
          <div className="fixed top-[1em] right-[1em]">
            <ThemeSwitch />
          </div>
          <section className="flex flex-row justify-between">
            <AnimatedDiv className="hidden lg:block h-fit">
              <Image
                isZoomed
                isBlurred
                width={"100vh"}
                className="h-screen w-screen rounded-none"
                fallbackSrc="http://via.placeholder.com/1200X600"
                alt="NextUI Fruit Image with Zoom"
                src={BGImage.src}
              />
            </AnimatedDiv>
            <section className="w-full lg:w-1/2 flex flex-col mx-auto justify-center items-center">
              <Logo />
              {children}
            </section>
          </section>
        </main>
      )}
    </section>
  );
};
