import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { createBackground, fontBase64, bgTextColor } from '../utils/basic.js';


export default function AnimeList(){
    const [titles, setTitles] = useState(null);

    useEffect(() => {
        fetch('https://ukranime-backend.fly.dev/api/anime_info')
            .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTitles(data)
            })
    }, [])

    if(!titles) { 
        return <l-zoomies
        size="80"
        stroke="5"
        bg-opacity="0.1"
        speed="1.4"
        color="white" 
        ></l-zoomies>; 
    }
    
    const title = titles.map((e, index) => (
        <AnimeCard key={index} poster={e.Poster} title={e.Title} episodes={e.Episodes} genres={e.Genres} release={e.Release_date} ></AnimeCard>
    ))

    return (
        <li>
            {title}
        </li>
    )
}