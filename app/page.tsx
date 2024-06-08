import { RightArrowIcon, SearchIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {Chip} from "@nextui-org/react";

export default function Home() {
  return (
    <section className="flex flex-col md:flex-row items-center space-between justify-between gap-2 py-6 md:py-10">
      <div className="inline-block md:w-1/2 text-left justify-center">
        <h1 className={title()}>Elevate Your Visual Storytelling with&nbsp;</h1>
        <br />
        <h1 className={title({ color: "violet" })}>
          AI-Powered Thumbnails
        </h1>
        <p className={`opacity-50 ${subtitle({ class: "my-4" })}`}>
          Our cutting-edge AI thumbnail generator takes the guesswork out of design, allowing you to focus on creating great content while maintaining a polished online presence.
        </p>
        <Button
          // onClick={() => {}}
          className="hidden md:flex bg-gradient-to-tr from-yellow-500 dark:from-pink-500 dark:to-yellow-500 to-pink-500 text-sm font-normal"
          endContent={<RightArrowIcon className="text-primary" />}
        >
          Start Creating Now 
        </Button>
      </div>


      <div className="flex flex-col w-auto md:max-w-6xl mt-10">
        <Input
          label="What do you want to create a thumbnail for?"
          isClearable
          radius="lg"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "w-[30vw] bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type here..."
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          endContent={
            <Button size="sm">
              Generate
            </Button>  
          }
        />
        <div className="text-left text-xs flex flex-col gap-2 p-2 md:max-w-[20vw]">
          <span className="font-semibold text-xs my-auto">Some Popular topics:</span>
          <div className="flex flex-col gap-1">
            <Chip key={1} variant="bordered" className="text-xs">
              How to make your first $1000
            </Chip>
            <Chip key={2} variant="bordered" className="text-xs">
              The #1 secret to a desirable outcome
            </Chip>
            <Chip key={3} variant="bordered" className="text-xs">
              The hidden benefits of keeping a routing
            </Chip>
          </div>
        </div>
      </div>
    </section>
  );
}
