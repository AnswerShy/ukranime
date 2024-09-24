import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './banner.css';

import createBackground from '../lib/creeping_line_animation.js'

export default function Banner(props) {
  const [bannerData, setBannerData] = useState(null); 
  const [error, setError] = useState(null);

  const bg = new createBackground();

  useEffect(() => {
    fetch(`https://ukranime-backend.fly.dev/api/anime_info?title=${props.title}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setBannerData(data[0]);
      })
      .catch(error => {
        setError(error.message);
      });

    
  }, []); 
  
  useEffect(() => {
    const section = document.querySelector("body")
    const previousBG = document.querySelectorAll(".ticker-row")
    if(section && previousBG) {
      previousBG.forEach(e => e.remove())
      bg.start(props.title, section, 9, 128)
    }
    else if (section) {
      bg.start(props.title, section, 9, 128)
    }
    else {
      // console.log(section)
    }
  }, [props.title])

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!bannerData) {
    return <l-zoomies
    size="80"
    stroke="5"
    bg-opacity="0.1"
    speed="1.4"
    color="white" 
  ></l-zoomies>; 
  }

  const bannerImage = bannerData.Banner ? (
    <img className="banner" height="656px" src={bannerData.Banner} alt="Anime Banner" />
  ) : null;

  const genres = bannerData.Genres.map((genre, index) => (
    <Link key={index} className="genre" to={`/List/${genre}`}>
      {genre}
    </Link>
  ));

  return (
    <>
      <section id="info">
        {bannerImage}
        <div id="info" className='container'>
          <p className="title-banner grid-item" >{bannerData.Title}</p>
          <div className="release_genres grid-item">
            <p className="genre">{bannerData.Release_date}</p>
            <p className="genre">•</p>
            {genres}
          </div>
          <p className="description grid-item">{bannerData.Description}</p>
        </div>
      </section>
    </>
  );
}