import "../homePage//homePage.scss";
import {useLayoutEffect,useState,useRef} from "react";
import InteractiveBlob from "../../components/interactiveBlob"
import {CurvedArrow} from "../../components/svgs"
import portrait from "../../resources/images/kushal-cutout.webp"
import { gsap } from "gsap/all";
import { useAppReady } from "../../components/loadingScreen";
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


    // false until the loading screen has finished leaving. The whole intro is
    // gated on it: the hero photograph is what the loading screen is waiting
    // for, so playing the headline before it arrives would animate the words
    // over an empty blob and then pop the figure in underneath them.
    const ready = useAppReady();

    // On desktop the last line is yellow type on a yellow page, so it is
    // already invisible and the blue slab growing behind it is what makes it
    // look like it surfaces out of the background. Stacked, the background
    // behind it is the photograph, so it reads straight away and the reveal
    // has nothing left to reveal. Hold it back and bring it in with the slab.
    const isStacked = () => window.matchMedia("(max-width:1024px)").matches;

    const SHADOW = "6px 4px 6px rgba(0, 0, 0, 0.3)";

    // Start states only, applied on mount and kept separate from the timeline
    // below. They have to be on the elements before anything is painted, and
    // they cannot wait for `ready` - otherwise the moment the loading screen
    // lifts there is one frame of the headline sitting at its final position
    // before the timeline is built.
    //
    // useLayoutEffect rather than useEffect for the same reason: useEffect runs
    // after the browser has painted, so the headline flashed in place for a
    // frame first. This runs before paint.
    useLayoutEffect(()=>{
        if(!INTRO_ANIMATION) return undefined;

        const lines = revealIntroRefs.current;

        gsap.set(lines,{xPercent:-125, yPercent:0});
        // scaleY rather than height: the slab is absolutely positioned at
        // 120% height, and scaling from the top edge avoids animating a
        // percentage height against a parent that has none of its own
        gsap.set(introRect,{scaleY:0, transformOrigin:"0% 0%"});

        if(isStacked()){
            // over the photograph this line is not camouflaged the way it is
            // on a yellow page, so instead of surfacing out of the slab it
            // travels in with the rest, shadow already on
            gsap.set(webDevRef,{xPercent:-125, yPercent:0, textShadow:SHADOW});
        }

        return ()=>{
            // never leave the headline stranded if this unmounts mid animation
            gsap.set(lines,{clearProps:"transform,textShadow"});
            gsap.set(webDevRef,{clearProps:"transform,opacity,visibility,textShadow"});
            gsap.set(introRect,{clearProps:"transform"});
        }
    },[])

    // The timeline. Built when the loading screen has gone, not on mount.
    useLayoutEffect(()=>{
        if(!INTRO_ANIMATION || !ready) return undefined;

        const lines = revealIntroRefs.current;
        const stacked = isStacked();
        let tl;
        let onVisible;

        const build = ()=>{
            // re-applied here as well as on mount, so the timeline can never
            // start from a state a re-render has moved on from. gsap.set is
            // idempotent, and gsap's own from() cannot do this job: it defers
            // its start state to the tween's first render, which with a delay
            // on the timeline leaves the headline painted in place until the
            // delay has elapsed.
            gsap.set(lines,{xPercent:-125, yPercent:0});
            gsap.set(introRect,{scaleY:0, transformOrigin:"0% 0%"});
            if(stacked) gsap.set(webDevRef,{xPercent:-125, yPercent:0, textShadow:SHADOW});

            // Phones and tablets run the whole sequence at a little over half
            // the desktop timing. The same pacing that reads as considered on a
            // wide screen reads as slow on a small one, where the viewer is
            // closer to the content and there is less of it to take in.
            const dur = stacked ? 0.78 : 1;
            const step = stacked ? 0.52 : 0.7;

            // Shorter than it was, because the loading screen's fade out is now
            // the pause that used to live here. Back to back the two read as a
            // page that has stopped responding.
            tl = gsap.timeline({duration:dur, delay: stacked ? 0.15 : 0.55, ease:"power3.easeIn"});

            if(stacked){
                tl.to([...lines, webDevRef],{stagger:step,xPercent:0});
                tl.to(lines,{textShadow:SHADOW});
                // the slab lands once the words have settled
                tl.to(introRect,{scaleY:1});
            }else{
                tl.to(lines,{stagger:step,xPercent:0});
                tl.to(webDevRef,{textShadow:SHADOW}, "<2");
                tl.to(lines,{textShadow:SHADOW});
                tl.to(introRect,{scaleY:1});
            }

            // hold at frame 0 so the start state can be inspected by hand
            if(FREEZE_INTRO_AT_START) tl.pause(0);
        }

        // Belt and braces. The loading screen already waits for the tab to be
        // on screen before it lifts, so this should never fire - but animation
        // frames are frozen in a background tab, and a timeline built there
        // would sit stalled partway through with the headline off screen.
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
        }
    },[ready])

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