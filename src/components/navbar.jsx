import gsap from "gsap"
import { useEffect, useRef, useState } from "react";
import {Link, Link as RouterLink, Outlet,useLocation} from "react-router-dom";
import kdLogo from "../resources/images/kd-webdev-logo.png";
import { LeftBracket, RightBracket } from "./svgs";
import { IconButton, SwipeableDrawer } from "@mui/material";
import { Menu } from "@mui/icons-material";

const navbarOptions = [
    {
        optionName:"About me",
        optionLink:"/about",
        key:1
    },
    {
        optionName:"My skills",
        optionLink:"/skills",
        key:2
    },
    {
        optionName:"Projects",
        optionLink:"/projects",
        key:3
    },
    {
        optionName:"Hire me!",
        optionLink:"/contact",
        key:4
    }
]

const Navbar = ()=>{

    let location = useLocation();
   let pathName =  location.pathname;
   let [open,setOpen] = useState(false)

    const menuRefs = useRef([]);
    menuRefs.current = [];

    const addMenuRef = (el) =>{
        if(el && !menuRefs.current.includes(el)){
            menuRefs.current.push(el)
        }
        // console.log(menuRefs)
    }

    let toggleOpenDrawer = ()=>{
        console.log("drawer open")
    }

    useEffect(()=>{
        if(pathName==="/"){
            gsap.from(menuRefs.current,{stagger:0.3,yPercent:-300,delay:6,ease:"power3.easeIn"});
        }
    },[])

    return(
        <>
            <div className="navbar">
                <div className="nav-op" id="nav-logo" ref={addMenuRef}>
                   <RouterLink to="/"> <img src={kdLogo}/></RouterLink>
                </div>
                <div className="nav-options">
                    <ul>
                        {navbarOptions.map((e)=>{
                            return(
                            <>
                            
                            <RouterLink to={e.optionLink} key={e.optionName} className="nav-op"><LeftBracket/><li ref={addMenuRef}>{e.optionName}</li> <RightBracket/></RouterLink>
                           
                            </>
                            );
                        })}
                    </ul>
                </div>
                <SwipeableDrawer  anchor="right" open={open} onClose={()=>{setOpen(false)}}>
                <div className="mobile-menu">
                <ul>
                        {navbarOptions.map((e)=>{
                            return(
                            <>
                            
                            <RouterLink to={e.optionLink} key={e.optionName} className="nav-op"><LeftBracket/><li onClick={()=>{setOpen(false)}} ref={addMenuRef}>{e.optionName}</li> <RightBracket/></RouterLink>
                           
                            </>
                            );
                        })}
                    </ul>
                    </div>
                </SwipeableDrawer>
            </div>
            <IconButton className="menu-btn" onClick = {()=>{setOpen(!open)}}><Menu/></IconButton>
            <Outlet/>
        </>
    )
}

export default Navbar
