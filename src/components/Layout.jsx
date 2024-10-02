import './Layout.css'
import { Outlet, NavLink } from "react-router-dom";
import "../fonts/GochiHand-Regular.ttf"

export default function Layout() {
    return (
        <>
            <header>
                {/* <NavLink to="/">UkrAnime</NavLink> •*/}
                <NavLink to={`${process.env.REACT_APP_FRONT_URL}/List`}>List</NavLink>
            </header>
            <Outlet/>
        </>
    );
}