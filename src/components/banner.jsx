import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './banner.css';
import { createBackground, fontBase64, bgTextColor } from '../utils/basic.js';
import scrollBG from '../utils/basic.js';

export default function Banner(props) {
  const bannerData = props.bannerData
  console.log(bannerData)
  const isBG = props.bg ? true : props.bg;

  const bg = isBG && new createBackground()
  
  useEffect(() => {
    isBG && bg.start(props.title, document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())
    scrollBG()
  }, [props.title])

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
    <Link key={index} className="genre" to={`${process.env.REACT_APP_FRONT_URL}/List/${genre}`}>
      {genre}
    </Link>
  ));

  return (
    <>
      <section className={props.customClass ? props.customClass : "Banner"} title={props.title} onLoad={props.onLoad}>
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
