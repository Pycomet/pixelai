"use client";
import { AnimatedDiv } from "../motion";
import Slider from "react-slick";
import Image from "next/image";

// Import Image
import PNG1 from "../../assets/thumbnails/test1.png";
import PNG3 from "@/assets/thumbnails/test3.png";
import PNG4 from "@/assets/thumbnails/test4.png";

export const ImageSlider: React.FC = () => {
    
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500
    };


    const availableImages: string[] = [PNG1.src, PNG3.src, PNG4.src];


    return (
        <AnimatedDiv isOpen={true} className="h-auto">
        <Slider {...settings}>
            {availableImages.map((src: string, index: number) => {
                return (
                    // <AnimatedDiv key={index}>
                        <Image
                            key={index}
                            src={src}
                            width={900}
                            height={900}
                            alt={`image_${index}`}
                        ></Image>
                    // </AnimatedDiv>
                );
            })}
        </Slider>
        </AnimatedDiv>
    );
};

export default ImageSlider;