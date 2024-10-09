import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import { createBackground, fontBase64, bgTextColor } from '../utils/basic.js';
import scrollBG from "../utils/basic.js";

import './Home.css'
import Banner from "../components/banner";

import selectSlide from '../lib/bannerSlider.js';

export default function Home() {
    const [isLastBannerVisible, setIsLastBannerVisible] = useState(false);

    const bg = new createBackground();
    
    useEffect(() => {
        selectSlide();
        bg.start("home", document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())
        scrollBG();
    }, [isLastBannerVisible])
    
    const handleBannerLoad = () => {
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