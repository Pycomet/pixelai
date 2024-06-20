"use client";
import { useState, useEffect } from "react";
import { AnimatedImages } from "../motion";

// Import Image
import PNG1 from "@/assets/thumbnails/test1.png";
import PNG3 from "@/assets/thumbnails/test3.png";
import PNG4 from "@/assets/thumbnails/test4.png";


export const ImageSlider: React.FC = () => {

    const [availableImages, setAvailableImages] = useState<string[]>([]);

    useEffect(() => {
        const loadImages = async () => { // Fetch 5 random images
            setAvailableImages([PNG1.src, PNG3.src, PNG4.src, PNG1.src, PNG3.src, PNG4.src, PNG4.src , PNG3.src]);
        };
        loadImages();
    }, []);
    return <AnimatedImages items={availableImages} isOpen={true} height={300} width={300} className="h-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" />;
};

export default ImageSlider;