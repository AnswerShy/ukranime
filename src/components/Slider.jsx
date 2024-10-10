import React, { useEffect, useState, useRef } from 'react';
import Banner from "../components/banner";
import "./Slider.css"

export default function Slider({ components }) {
    const [arrayOfComponents, setArrayOfComponents] = useState([]);
    const [slideTrigger, setSlideTrigger] = useState(true)
    const [activeSlide, setActiveSlide] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        components.length > 0 ? setArrayOfComponents(components) : console.log("0");
    }, []);

    useEffect(() => {
        if(slideTrigger) {
            setSlideTrigger(false)
            timeoutRef.current = setTimeout(() => {
                nextSlide();
                setSlideTrigger(true)
            }, 2500)
        }
    }, [slideTrigger])

    const nextSlide = () => {
        setActiveSlide(activeSlide === arrayOfComponents.length - 1 ? 0 : activeSlide + 1)
    }
    const selectSlide = (index) => {
        setActiveSlide(index)
        setSlideTrigger(false)
        
        clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            nextSlide();
            setSlideTrigger(true)
        }, 5000)
    }

    return (
        <div className="containerOfNews">
            {arrayOfComponents.map((e, index) => (
                <Banner
                    customClass={activeSlide === index ? "Banner here" : "Banner"}
                    key={index}
                    bannerData={e}
                />
            ))}
            <span className="indicatorOfNews">
                {arrayOfComponents.map((e, index) => (
                    <button key={index} className="indicator" onClick={() => selectSlide(index)}>
                        <div className={activeSlide === index ? "in-progress" : "out-progress"}></div>
                    </button>
                ))}
            </span>
        </div>
    );
}