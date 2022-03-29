import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import lottieGif from "../../resources/lotties/animation_640_kn4pvdxr.gif";
import "./aboutPage.scss"


const AboutPage = () => {
    let lottieRef = useRef(null);

    useEffect(()=>{
        lottie.loadAnimation({
            container:lottieRef,
            // animationData:
        })
    },[])
    return(
        <>
            <div className="about-page-container">
                <div className="about-content">
                    <h2>About me</h2>
                    <p>I was always fond of creating things and solving problems.</p>
                    <p>Coding and programming never struck the light bulb in my head before like it did during the start of the pandemic,</p>
                    <p>I gave it a lot of thought and started my journey to become a web developer then on.</p>
                    <p> I really loved the idea of being able to create something just out of using a desk, laptop and my brain! I</p>
                    <p>have never before enjoyed learning and creating new things everyday as much as I have been enjoying it </p>
                    <p>since the start of this journey! </p>
                    <p>Many more and new mental and virtual challenges are awaited!</p>
                </div>
                <div className="about-img" ref={el=>lottieRef=el}>
                    <img src={lottieGif}/>
                </div>

            </div>
        </>
    )
}

export default AboutPage