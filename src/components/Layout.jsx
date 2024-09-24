import './Layout.css'
import { Outlet, NavLink } from "react-router-dom";


export default function Layout() {
    return (
        <>
            <header>
                {/* <NavLink to="/">UkrAnime</NavLink> */}
                •
                <NavLink to="/List">List</NavLink>
            </header>
            <Outlet/>
        </>
    );
}