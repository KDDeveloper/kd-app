import "../homePage//homePage.scss";
import {useEffect,useState,useRef} from "react";
import {Blob} from "../../components/svgs"
import { gsap } from "gsap/all";
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


    useEffect(()=>{
        let tl = gsap.timeline({duration:1,delay:1,ease:"power3.easeIn"});
        tl.from(revealIntroRefs.current,{stagger:0.7,xPercent:-120})
        tl.to(webDevRef,{textShadow:"6px 4px 6px rgba(0, 0, 0, 0.3)"}, "<2");
       
        tl.to(revealIntroRefs.current,{textShadow:"6px 4px 6px rgba(0, 0, 0, 0.3)"});
        tl.from(introRect,{height:0})
        
    },[])

    return(
        <>
            <div className="homepage-container">
                <div className="intro-container">
                    <h1 className="intro" ref={addToRef}>HI<span style={{color:"#1B86BC"}}>,</span></h1>
                    <h1 className="intro" ref={addToRef}>I am Kushal Davda<span style={{color:"#1B86BC"}}>,</span></h1>
                    <h1 className="intro" ref={addToRef}>Full stack</h1>
                    <h1 className="intro" id="web-developer" ref={el=>webDevRef=el}>Web Developer<span style={{color:"#FFDE00"}}>.</span>
                    <div className="intro-rectangle" ref={el=>introRect=el}></div>
                    </h1>

                </div>
                <div className="graphics-container">
                    <Blob/>
                </div>
            </div>
        </>
    )
}

export default HomePage