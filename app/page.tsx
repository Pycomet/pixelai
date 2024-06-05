import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Boost&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Clicks & Views&nbsp;</h1>
        <br />
        <h1 className={title()}>
          with AI-Powered Thumbnail Magic
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Unleash the Future of Visual Storytelling and Watch Your Content Shine!
        </h2>
      </div>
    </section>
  );
}
