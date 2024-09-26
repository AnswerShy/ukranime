import HLS from 'hls.js'
import './Player.css'
import PlayerElement from '../lib/UkrAnimePlayer.js'
import { useEffect, useState, useRef } from 'react'

export default function Player(props) {
    const playerRef = useRef(null)
    const videoFrame = document.querySelector("video")

    useEffect(() => {
      const playerElementWork = new PlayerElement();
      const { episodeName, player, episodes } = playerElementWork.setup(props.assetsUrl);
      console.log(`lol ${props.assetsUrl}`)

      if (playerRef.current) {
        const videoFrame = playerRef.current.querySelector("video");

        if (!videoFrame) {
          playerRef.current.appendChild(episodeName);
          playerRef.current.appendChild(player);
          playerRef.current.appendChild(episodes);
        }

        playerElementWork.playthis(props.title);
        playerElementWork.controls();           
      }
    }, [props.title]);

    

    return (
        <section className='player' ref={playerRef} />
    )
}