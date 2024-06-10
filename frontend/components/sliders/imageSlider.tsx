"use client";
import { AnimatedDiv } from "../motion";
import Slider from "react-slick";


export const ImageSlider: React.FC = () => {
    
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500
    };

    return (
        <AnimatedDiv>
        <Slider {...settings}>
            <div>
            <h3>1</h3>
            </div>
            <div>
            <h3>2</h3>
            </div>
            <div>
            <h3>3</h3>
            </div>
            <div>
            <h3>4</h3>
            </div>
            <div>
            <h3>5</h3>
            </div>
            <div>
            <h3>6</h3>
            </div>
        </Slider>
        </AnimatedDiv>
    );
};

export default ImageSlider;