import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import { createBackground, fontBase64, bgTextColor } from '../utils/basic.js';
import scrollBG from "../utils/basic.js";

import './Home.css'
import Slider from "../components/Slider.jsx";


export default function Home() {
    var [dataSlider, setDataSlider] = useState([]);

    useEffect(() => {
        fetch(`https://ukranime-backend.fly.dev/api/anime_info`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dataToFetch = data.slice(0, 3)
            setDataSlider(dataToFetch)
        })
        .catch(error => {
            console.log(error)
        });
    }, [])
    
    const bg = new createBackground();
    bg.start("home", document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())

    return (
        <>
            {
                dataSlider.length > 0 ? (<Slider components={dataSlider} />) : (<l-zoomies size="80" stroke="5" bg-opacity="0.1" speed="1.4" color="white"></l-zoomies>)
            }
            
            <p className="sticky-text-xD">HOME</p>
        </>
    );
}