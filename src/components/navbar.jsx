import { useEffect, useState } from "react";
import {Link, Link as RouterLink, Outlet,useLocation} from "react-router-dom";
import kdLogo from "../resources/images/kd-webdev-logo.png";
import { LeftBracket, RightBracket } from "./svgs";
import { IconButton } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";

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
        optionName:"Let's talk",
        optionLink:"/contact",
        key:4
    }
]

// Set to false to freeze the page in its finished state - useful when tuning
// layout, since screenshots then never catch a mid animation frame.
const INTRO_ANIMATION = true;

// The logo doubles as the home link on desktop, but the circle menu has no logo
// in it - so home is listed explicitly there. Kept separate from navbarOptions
// so the desktop bar is not given a fifth item.
const menuOptions = [{optionName:"Home", optionLink:"/", key:0}, ...navbarOptions];

const Navbar = ()=>{

    let location = useLocation();
   let pathName =  location.pathname;
   let [open,setOpen] = useState(false)

    // "waiting" holds the menu off screen, "playing" runs the drop in.
    let [introStage,setIntroStage] = useState(INTRO_ANIMATION && pathName==="/" ? "waiting" : "done");

    // The menu is held off screen by a plain css class while it waits, and the
    // wait itself is a timer.
    //
    // The old gsap.from() parked the menu off screen and relied on the tween to
    // bring it back. Both tweens and css animations are frozen while a tab is in
    // the background, so any stall during those six seconds left the menu
    // stranded above the viewport with nothing scheduled to reveal it. Timers
    // are not frozen the same way, so the reveal is driven by a timer and a
    // state change rather than by an animation running to completion.
    useEffect(()=>{
        if(!INTRO_ANIMATION || pathName!=="/") return;

        let onVisible;

        const play = ()=> setIntroStage("playing");

        const timer = setTimeout(()=>{
            if(document.visibilityState==="visible"){
                play();
                return;
            }
            // off screen right now, so wait rather than animate into nothing
            onVisible = ()=>{
                if(!document.hidden){
                    document.removeEventListener("visibilitychange",onVisible);
                    play();
                }
            }
            document.addEventListener("visibilitychange",onVisible);
        // the hero intro is quicker on phones and tablets, so the menu should
        // not still be sitting off screen long after it has finished
        }, window.matchMedia("(max-width:1024px)").matches ? 4500 : 6000);

        return ()=>{
            clearTimeout(timer);
            if(onVisible) document.removeEventListener("visibilitychange",onVisible);
        }
    },[])

    // The circle is corner anchored rather than full screen, so tapping the page
    // outside it should close it - and Escape should too, since it is a modal
    // surface once open.
    useEffect(()=>{
        if(!open) return;

        const onAway = (e)=>{
            if(e.target.closest(".circle-menu") || e.target.closest(".circle-links") || e.target.closest(".menu-btn")) return;
            setOpen(false);
        }
        const onKey = (e)=>{
            if(e.key==="Escape") setOpen(false);
        }

        document.addEventListener("pointerdown",onAway);
        document.addEventListener("keydown",onKey);

        return ()=>{
            document.removeEventListener("pointerdown",onAway);
            document.removeEventListener("keydown",onKey);
        }
    },[open])

    const introClass = introStage==="waiting" ? " nav-waiting"
                     : introStage==="playing" ? " nav-intro"
                     : "";

    return(
        <>
            <div className={"navbar" + introClass}>
                <div className="nav-op" id="nav-logo">
                   <RouterLink to="/"> <img src={kdLogo}/></RouterLink>
                </div>
                <div className="nav-options">
                    <ul>
                        {navbarOptions.map((e)=>{
                            return(
                            <>
                            
                            <RouterLink to={e.optionLink} key={e.optionName} className="nav-op"><LeftBracket/><li>{e.optionName}</li> <RightBracket/></RouterLink>

                            </>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className={open ? "circle-backdrop circle-backdrop-open" : "circle-backdrop"}/>

            {/* The circle's centre is pinned to the menu button and it scales
                up from nothing, so the menu inflates out of the button rather
                than sliding in from an edge. --i drives both the radial
                placement of each link and the stagger on its arrival. */}
            <div className={open ? "circle-menu circle-menu-open" : "circle-menu"}/>

            {/* A sibling of the disc, not a child. The disc carries a transform,
                and a transformed ancestor captures position:fixed descendants -
                so nested inside it the list could not be positioned against the
                viewport. */}
            <ul className={open ? "circle-links circle-links-open" : "circle-links"}>
                {menuOptions.map((e,i)=>{
                    return(
                        <li key={e.optionName} style={{"--i":i}}>
                            <RouterLink to={e.optionLink}
                                onClick={()=>{setOpen(false)}}
                                // not reachable by keyboard while the circle is closed
                                tabIndex={open ? 0 : -1}>
                                <LeftBracket/>{e.optionName}<RightBracket/>
                            </RouterLink>
                        </li>
                    );
                })}
            </ul>

            <IconButton className="menu-btn" onClick={()=>{setOpen(!open)}}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}>
                {open ? <Close/> : <Menu/>}
            </IconButton>
            <Outlet/>
        </>
    )
}

export default Navbar
