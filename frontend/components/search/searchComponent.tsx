"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import {Chip} from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@nextui-org/button";
import { AnimatedDiv, AnimatedList } from "@/components/motion";
import { SearchIcon } from "@/components/icons";
import { button } from "@/components/primitives";
import { siteConfig } from "@/config/site";


export const SearchComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    return (
        <AnimatedDiv className="inline-block w-fit md:w-1/2 mt-10 md:ml-10 md:pl-[5vw] justify-center md:justify-end items-right">
            <Input
            label="What do you want to create a thumbnail for?"
            isClearable
            radius="lg"
            classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                "w-[80vw] bg-transparent",
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
            value={inputValue}
            onChange={handleInputChange}
            startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
                <AnimatedDiv
                    isOpen={inputValue !== ""}
                >
                    <Button size="sm" className={button()}>
                        Generate
                    </Button>
                </AnimatedDiv>
            }
            />
            <div className="text-left text-xs flex flex-col gap-2 p-2 md:max-w-[40vw]">
            {inputValue !== "" ? (
                <AnimatedDiv isOpen={inputValue !== ""}>
                    <span className="font-semibold text-xs my-auto">Some Popular topics:</span>
                    <div className="flex flex-col mt-2 gap-1">
                        <AnimatedList items={siteConfig.searchTopics.map((topic: string, index: number) => (
                                <Chip  onClose={() => console.log("close")} key={index} variant="bordered" className="text-xs">
                                    {topic}
                                </Chip>
                            ))} isOpen={inputValue !== ""} />
                    </div>
                </AnimatedDiv>
            ) : (
                <Skeleton className="rounded-lg opacity-50 w-full items-right">
                    <div className="h-4 rounded-lg bg-secondary"></div>
                </Skeleton>
            )}
            </div>
        </AnimatedDiv>
    );
};

export default SearchComponent;