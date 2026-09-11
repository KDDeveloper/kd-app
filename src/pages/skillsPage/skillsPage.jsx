import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import "./skillsPage.scss";
import Lottie from "lottie-web";
import brainLottie from "../../resources/lotties/brainLevel.json";
import gsap from "gsap";
import AnimatedNumber from "react-animated-number";
import PageHeading from "../../components/pageHeading";

const skills = [
    { skillName:"HTML", progress:99 },
    { skillName:"CSS", progress:97 },
    { skillName:"Vanilla javascript", progress:95 },
    { skillName:"React", progress:95 },
    { skillName:"Node js", progress:96 },
    { skillName:"Claude AI", progress:90 },
]

// lottie wants 0-1 rgb
const PURPLE = [108/255, 55/255, 255/255];  // #6c37ff, as the animation ships
const BLUE = [27/255, 134/255, 188/255];    // #1B86BC, the site's blue

// The animation's base colour is the one thing about it that is off brand - it
// is the only purple anywhere on the site. It appears on two layers, so it gets
// swapped for the site blue on the way in and everything else, counter and all
// the other colours included, is left exactly as the file ships. Doing it here
// beats hand editing 289KB of generated json to change one value.
const recolourBrain = (data) => {
    const clone = JSON.parse(JSON.stringify(data));
    const near = (a,b) => Math.abs(a-b) < 0.01;

    const swap = (node) => {
        if(Array.isArray(node)){
            node.forEach(swap);
            return;
        }
        if(!node || typeof node !== "object") return;

        Object.keys(node).forEach(key => {
            const value = node[key];
            const isColour = key === "c" && value && Array.isArray(value.k) && typeof value.k[0] === "number";

            if(!isColour){
                swap(value);
                return;
            }

            if(near(value.k[0],PURPLE[0]) && near(value.k[1],PURPLE[1]) && near(value.k[2],PURPLE[2])){
                value.k = [BLUE[0], BLUE[1], BLUE[2], value.k[3] === undefined ? 1 : value.k[3]];
            }
        });
    };

    swap(clone.layers);

    return clone;
}

const SkillsPage = ()=>{
    const location = useLocation();
    const lottieRef = useRef(null);
    const barRefs = useRef([]);
    barRefs.current = [];

    const addBarRef = (el) => {
        if(el && !barRefs.current.includes(el)){
            barRefs.current.push(el)
        }
    }

    useEffect(()=>{
        const animation = Lottie.loadAnimation({
            container: lottieRef.current,
            animationData: recolourBrain(brainLottie),
            renderer:"svg",
            loop:false,
            autoplay:true
        });

        gsap.from(barRefs.current,{duration:2,width:0,ease:"power3.easeOut"});

        // without this the animation is rebuilt and stacked on top of itself
        // every time you navigate back to the page
        return ()=> animation.destroy();
    },[location])

    return(
        <>
            <div className="skills-page-container">
                <div className="skills-container">
                    <PageHeading lead="My" accent="Skills"/>
                   {
                       skills.map((el)=>{
                           return(
                            <div className="skill" key={el.skillName}>
                            <div className="skill-content-container">
                                <h3 className="skill-name">{el.skillName}</h3>
                                <AnimatedNumber
                                    value={el.progress}
                                    duration={2400}
                                    stepPrecision={0}
                                    formatValue={n => isNaN(n) ? "0" : n.toFixed(0)}
                                    className="skill-number"/>
                            </div>
                            <div className="skill-bar">
                                <div className="skill-bar-rect" style={{width:`${el.progress+''}%`}} ref={addBarRef}></div>
                                <div className="skill-bar-br br1"></div>
                                <div className="skill-bar-br br2"></div>
                                <div className="skill-bar-br br3"></div>
                            </div>
                            </div>
                           )
                       })
                   }
                    <p id="note">Note: I believe learning is a lifelong process. More skills, coming soon..</p>
                </div>
                <div className="skills-image" ref={lottieRef}></div>
            </div>
        </>
    )
}

export default SkillsPage
