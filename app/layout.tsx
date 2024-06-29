import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
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
          </div>
        </Providers>
      </body>
    </html>
  );
}
