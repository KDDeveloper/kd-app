import { useEffect, useRef } from "react"
import "./skillsPage.scss";
import Lottie from "lottie-web";
import brainLottie from "../../resources/lotties/brainLevel.json";
import gsap from "gsap";
import AnimatedNumber from "react-animated-number";



const SkillsPage = ()=>{
    let lottieRef = useRef(null);
    let HTMLProgress = useRef(null);
    let CSSProgress = useRef(null);
    let vjProgress = useRef(null);
    let reactProgress = useRef(null);
    let nodejsProgress = useRef(null);

    const skills = [
        {
            skillName:"HTML",
            progress:99,
            ref:HTMLProgress,
        },
        {
            skillName:"CSS",
            progress:97,
            ref:CSSProgress
        },
        {
            skillName:"Vanilla javascript",
            progress:87,
            ref:vjProgress
        },
        {
            skillName:"React",
            progress:80,
            ref:reactProgress
        },
        {
            skillName:"Node js",
            progress:80,
            ref:nodejsProgress
        },
    ]
    useEffect(()=>{
        Lottie.loadAnimation({
            container:lottieRef,
            animationData:brainLottie,
            renderer:"svg",
            loop:false,
            autoplay:true
            
            
        });

        gsap.from(HTMLProgress.current,{duration:2,width:0,ease:"power3.easeOut"});
        gsap.from(CSSProgress.current,{duration:2,width:0,ease:"power3.easeOut"})
        gsap.from(vjProgress.current,{duration:2,width:0,ease:"power3.easeOut"})
        gsap.from(reactProgress.current,{duration:2,width:0,ease:"power3.easeOut"})
        gsap.from(nodejsProgress.current,{duration:2,width:0,ease:"power3.easeOut"})
    },[])

    return(
        <>
            <div className="skills-page-container">
                <div className="skills-container">
                    <h1>Skills</h1>
                   {
                       skills.map((el)=>{
                           return(
                            <div className="skill" key={el.skillName}>
                            <div className="skill-content-container">
                                <h3 className="skill-name">{el.skillName}</h3>
                                <AnimatedNumber
                                    value={el.progress}
                                    duration={2400}
                                    formatValue={n=>n.toFixed(0)}
                                    style={{transition:"1s ease-out"}}

                                className="skill-number"/>
                            </div>
                            <div className="skill-bar">
                                <div className="skill-bar-rect" style={{width:`${el.progress+''}%`}} ref={el.ref}></div>
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
                <div className="skills-image" ref={el=>lottieRef=el}></div>
            </div>
        </>
    )
}

export default SkillsPage