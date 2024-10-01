import { useParams } from "react-router-dom";
import React, { useEffect } from 'react';

import './Home.css'
import Banner from "../components/banner";

import createBackground from '../lib/creeping_line_animation.js'
import selectSlide from '../lib/bannerSlider.js';

export default function Home() {
    const {title} = useParams();
    const bg = new createBackground();
    bg.start("home", document.querySelector("#root"), 9, 128)
    setTimeout(() => {
        selectSlide();
    }, 5000)
    return (
        <>
            <div className="containerOfNews">
                <Banner title="Samurai%20Champloo" bg={false} slide={true}/>
                <Banner title="Ergo%20Proxy" bg={false}/>
                <Banner title="Monster" bg={false}/>
            </div>
            
            <p className="sticky-text-xD">HOME</p>
        </>
    );
}