import { RightArrowIcon } from "@/components/icons";
import { title, subtitle, button } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import SearchComponent from "@/components/search/searchComponent";
import { AnimatedDiv } from "@/components/motion";
import ImageSlider from "@/components/sliders/imageSlider";

export default function Home() {
  
  return (
    <section>
      <section className="flex flex-col md:flex-row items-center space-between justify-between gap-2 md:gap-[2vw] lg:gap-[4vw] py-6 md:py-10">
        <AnimatedDiv className="inline-block md:w-1/2 text-left justify-center ">
          <h1 className={title()}>Elevate Your Visual Storytelling with&nbsp;</h1>
          <br />
          <h1 className={title({ color: "pink" })}>
            AI-Powered Thumbnails
          </h1>
          <p className={subtitle({ class: "my-4" })}>
            Our cutting-edge AI thumbnail generator takes the guesswork out of design, allowing you to focus on creating great content while maintaining a polished online presence.
          </p>
          <Button
            // onClick={() => {}}
            className={button({ hideOnMobile: true })}
            endContent={<RightArrowIcon className="text-primary" />}
          >
            Start Creating Now 
          </Button>
        </AnimatedDiv>

        <SearchComponent />
      </section>

      <section className="flex flex-col">
        <p className={`${title({ size: "xs" })} pb-2`}>Popular picks</p>
        <ImageSlider />
      </section>

    </section>
  );
}
