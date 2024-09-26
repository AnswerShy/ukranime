import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Banner from "../components/banner";
import Player from "../components/Player";

export default function Anime() {
    const {title} = useParams(); 
    return (
        <>
            <Banner title={title}/>
            <Player title={title} assetsUrl={process.env.REACT_APP_FRONT_URL}/>
        </>
    );
}