import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import { createBackground, fontBase64, bgTextColor } from '../utils/basic.js';
import scrollBG from "../utils/basic.js";

import './Home.css'
import Banner from "../components/banner";

export default function Home() {
    const [isLastBannerVisible, setIsLastBannerVisible] = useState(false);

    const bg = new createBackground();

    useEffect(() => {
        import('../lib/bannerSlider.js')
            .then(({ default: selectSlide }) => 
            {
                setTimeout(selectSlide, 2500)
            })
            .catch(e => console.log("Failed to load selectSlide", e));
    }, [isLastBannerVisible])

    useEffect(() => {
        bg.start("home", document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())
        scrollBG();
    }, [isLastBannerVisible])
    
    const handleBannerLoad = () => {
        document.querySelector(".Banner").classList.add("here")
        setIsLastBannerVisible(true)
    }
    
    return (
        <>
            <div className="containerOfNews">
                <Banner title="Samurai%20Champloo" bg={false} slide={true}/>
                <Banner title="Ergo%20Proxy" bg={false}/>
                <Banner title="Monster" bg={false} onLoad={handleBannerLoad}/>
            </div>
            
            <p className="sticky-text-xD">HOME</p>
        </>
    );
}