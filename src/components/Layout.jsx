import './Layout.css'
import { useState, useEffect } from "react";
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import { createBackground, fontBase64, bgTextColor } from '../utils/basic.js';

export default function Layout() {
    const [currentWindow, setCurrentWindow] = useState(1);
    const [menuOpen, setMenuOpen] = useState(0);
    const location = useLocation()

    const {title} = useParams();
    const bg = new createBackground()

    useEffect(() => {
        if(location.pathname === `${process.env.REACT_APP_FRONT_URL}/`) {
            setCurrentWindow(0)
        }
        else if(location.pathname === `${process.env.REACT_APP_FRONT_URL}/List`) {
            setCurrentWindow(1)
        }
    })
    
    useEffect(() => {
        if(title){
            bg.start(title, document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())
        }   
        else if(currentWindow == 0) {
            bg.start("home", document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())
        }
        else if (currentWindow == 1){
            bg.start("List", document.querySelector("#root"), 9, 128, bgTextColor, null, fontBase64())
        }      
    }, [currentWindow, title])

    const openMenuFunc = () => {
        if(menuOpen === 0) {
            setMenuOpen(1)
        }
        else {
            setMenuOpen(0)
        }
    }

    useEffect(() => {
        if(menuOpen === 0) {
            document.querySelector("header").classList.remove("min-disp-menu-show")
        }
        else {
            document.querySelector("header").classList.add("min-disp-menu-show")
        }
        
    }, [menuOpen])

    return (
        <>
            <header>
                <img src={`${process.env.REACT_APP_FRONT_URL}/assets/icons/menu_button.svg`} className='MenuButtonHeader' onClick={openMenuFunc}></img>
                <NavLink to={`${process.env.REACT_APP_FRONT_URL}/`}>UkrAnime</NavLink>
                <separator>•</separator>
                <NavLink to={`${process.env.REACT_APP_FRONT_URL}/List`}>List</NavLink>
            </header>
            <img src={`${process.env.REACT_APP_FRONT_URL}/assets/icons/menu_button.svg`} className='MenuButtonHeader' onClick={openMenuFunc}></img>
            <Outlet/>
        </>
    );
}