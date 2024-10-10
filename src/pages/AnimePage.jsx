import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Banner from "../components/banner";
import Player from "../components/Player";

export default function Anime() {
    const [bannerData, setBannerData] = useState(null); 
    const {title} = useParams();
    
    useEffect(() => {
        fetch(`https://ukranime-backend.fly.dev/api/anime_info?title=${title}`)
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
            throw new Error(error)
          });
      }, []); 
    return (
        <>
            <Banner title={title} bannerData={bannerData} bg={true}/>
            <Player title={title}/>
        </>
    );
}