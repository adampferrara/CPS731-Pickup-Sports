import React from 'react';
import { FaRegHeart, FaMoon, FaSun, FaBook } from "react-icons/fa";
import { FiHome, FiLogOut } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import { Link } from 'react-router-dom';
import * as themeActions from "../../redux/actions/theme.action";
import { useDispatch, useSelector } from "react-redux";

import './styles.css';

import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';



const Sidenav = ({ menuCollapse, setMenuCollapse, setisSignedIn, setPageName }) => {

    const collapseMenu = () => {
        setMenuCollapse(true);
    };

    const openMenu = () => {
        setMenuCollapse(false);
    };

    const handleSignout = () => {
        dispatch({ type: "LOGOUT" });
        dispatch({ type: "CLEAR_FAVOURITE" });
        setisSignedIn(false);
        window.location.reload();
    };

    const dispatch = useDispatch();
    const themeReducer = useSelector(({ theme }) => theme);
    return (
        <div className="header">
            <ProSidebar collapsed={menuCollapse} onMouseOver={openMenu} onMouseLeave={collapseMenu}>
                <SidebarHeader>
                    <div className="logotext">
                        
                    <>{menuCollapse ?  <div className="d-flex flex-column align-items-center p-1 py-1"><img className="rounded-circle mt-2" width="50px"
                            src="https://www.pngitem.com/pimgs/m/244-2443980_sports-icon-basketball-designs-on-paper-hd-png.png"
                                alt="Logo"></img></div > : <div className="d-flex flex-row align-items-start p-1 py-1"><img className="rounded-circle mt-3" width="50px"
                                src="https://www.pngitem.com/pimgs/m/244-2443980_sports-icon-basketball-designs-on-paper-hd-png.png"
                                    alt="Logo"></img><span className="d-flex flex-column align-self-center p-1 py-0">Pickup Sports</span></div>}</>
                    
                    </div>
                </SidebarHeader>

                <SidebarContent >
                    <Menu>
                        <MenuItem icon={<FiHome />}>
                            Map
                            <Link to="/map" />
                        </MenuItem>
                        <MenuItem icon={<FaBook />} >
                            Hosted Games
                            <Link to="/game_hosted" />
                        </MenuItem>
                        <MenuItem icon={<FaRegHeart />} >
                            Joined Games
                            <Link to="/game_joined" />
                        </MenuItem>
                        <MenuItem icon={<RiPencilLine />} >
                            Game Requests
                            <Link to="/game_requests" />
                        </MenuItem>
                        <MenuItem icon={<BiCog />} >
                            User Profile
                            <Link to="/user_profile" />
                        </MenuItem>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu>
                        <MenuItem icon={themeReducer.theme ? <FaSun /> : <FaMoon />} onClick={() => dispatch(themeActions.ToggleTheme(!themeReducer.theme))}>
                            Change Theme
                        </MenuItem>
                        <MenuItem icon={<FiLogOut />} onClick={handleSignout} >
                            Logout
                        </MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
};

export default Sidenav;