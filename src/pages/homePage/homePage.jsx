import "../homePage//homePage.scss";
import {useLayoutEffect,useState,useRef} from "react";
import InteractiveBlob from "../../components/interactiveBlob"
import {CurvedArrow} from "../../components/svgs"
import portrait from "../../resources/images/kushal-cutout.webp"
import { gsap } from "gsap/all";
// Set to false to freeze the page in its finished state - useful when tuning
// layout, since screenshots then never catch a mid animation frame.
const INTRO_ANIMATION = true;

// DEBUG: set true to build every start state and then hold the timeline at
// frame 0, so the intro never plays. Whatever is on screen is exactly what the
// animation begins from - anything visible here is visible before it runs.
const FREEZE_INTRO_AT_START = false;

const HomePage = () =>{

    const revealIntroRefs = useRef([]);
    let introRect = useRef(null);
    let webDevRef = useRef(null);
    revealIntroRefs.current = [];

    const addToRef = (el) => {
        if(el && !revealIntroRefs.current.includes(el)){
            revealIntroRefs.current.push(el)
        }

        // console.log(revealIntroRefs);
    }


    // useLayoutEffect, not useEffect: gsap.from() parks the lines off screen the
    // moment the timeline is built, and useEffect runs after the browser has
    // already painted - so the headline flashed at its final position for a
    // frame first. This runs before paint, so the first thing drawn is the
    // start of the animation.
    useLayoutEffect(()=>{
        if(!INTRO_ANIMATION) return;

        const lines = revealIntroRefs.current;
        let tl;
        let onVisible;

        // On desktop the last line is yellow type on a yellow page, so it is
        // already invisible and the blue slab growing behind it is what makes it
        // look like it surfaces out of the background. Stacked, the background
        // behind it is the photograph, so it reads straight away and the reveal
        // has nothing left to reveal. Hold it back and bring it in with the slab.
        const stacked = window.matchMedia("(max-width:1024px)").matches;

        const shadow = "6px 4px 6px rgba(0, 0, 0, 0.3)";

        const build = ()=>{
            // Every start state is applied synchronously, outside the timeline,
            // so the first painted frame is already the start of the animation.
            // gsap's from() defers its start state to the tween's own first
            // render, and this timeline carries a 1s delay - which left the
            // headline painted at its final position for that whole second.
            gsap.set(lines,{xPercent:-125, yPercent:0});
            // scaleY rather than height: the slab is absolutely positioned at
            // 120% height, and scaling from the top edge avoids animating a
            // percentage height against a parent that has none of its own
            gsap.set(introRect,{scaleY:0, transformOrigin:"0% 0%"});

            if(stacked){
                // over the photograph this line is not camouflaged the way it is
                // on a yellow page, so instead of surfacing out of the slab it
                // travels in with the rest, shadow already on
                gsap.set(webDevRef,{xPercent:-125, yPercent:0, textShadow:shadow});
            }

            // Phones and tablets run the whole sequence at a little over half
            // the desktop timing. The same pacing that reads as considered on a
            // wide screen reads as slow on a small one, where the viewer is
            // closer to the content and there is less of it to take in.
            const dur = stacked ? 0.78 : 1;
            const step = stacked ? 0.52 : 0.7;

            tl = gsap.timeline({duration:dur, delay: stacked ? 0.25 : 1, ease:"power3.easeIn"});

            if(stacked){
                tl.to([...lines, webDevRef],{stagger:step,xPercent:0});
                tl.to(lines,{textShadow:shadow});
                // the slab lands once the words have settled
                tl.to(introRect,{scaleY:1});
            }else{
                tl.to(lines,{stagger:step,xPercent:0});
                tl.to(webDevRef,{textShadow:shadow}, "<2");
                tl.to(lines,{textShadow:shadow});
                tl.to(introRect,{scaleY:1});
            }

            // hold at frame 0 so the start state can be inspected by hand
            if(FREEZE_INTRO_AT_START) tl.pause(0);
        }

        // gsap.from() parks the headline off screen the moment the timeline is
        // built and only brings it back as the timeline plays. Animation frames
        // are frozen while a tab is in the background, so building this on a
        // page loaded out of focus leaves the headline stranded off screen
        // with nothing scheduled to reveal it. Wait until the page is on screen.
        if(document.hidden){
            onVisible = ()=>{
                if(!document.hidden){
                    document.removeEventListener("visibilitychange",onVisible);
                    build();
                }
            }
            document.addEventListener("visibilitychange",onVisible);
        }else{
            build();
        }

        return ()=>{
            if(onVisible) document.removeEventListener("visibilitychange",onVisible);
            if(tl) tl.kill();
            // never leave the headline stranded if this unmounts mid animation -
            // autoAlpha matters here, or the last line stays invisible
            gsap.set(lines,{clearProps:"transform,textShadow"});
            gsap.set(webDevRef,{clearProps:"transform,opacity,visibility,textShadow"});
            gsap.set(introRect,{clearProps:"transform"});
        }
    },[])

    return(
        <>
            <div className="homepage-container">
                <div className="intro-container">
                    <h1 className="intro" ref={addToRef}>HI<span style={{color:"#1B86BC"}}>,</span></h1>
                    <h1 className="intro" ref={addToRef}>I am Kushal Davda<span style={{color:"#1B86BC"}}>,</span></h1>
                    <h1 className="intro" ref={addToRef}>Full stack</h1>
                    <h1 className="intro" id="web-developer" ref={el=>webDevRef=el}>Developer<span style={{color:"#FFDE00"}}>.</span>
                    <div className="intro-rectangle" ref={el=>introRect=el}></div>
                    </h1>

                </div>
                <div className="graphics-container">
                    {/* one box holding the whole hero graphic - everything
                        inside is sized as a percentage of it, so the blob, the
                        figure and the hint scale together at any window size */}
                    <div className="hero-composition">
                        <InteractiveBlob/>
                        <img className="hero-portrait" src={portrait} alt="Kushal Davda"/>
                        <div className="play-hint" aria-hidden="true">
                            <span className="play-hint-text">poke it</span>
                            <CurvedArrow/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage