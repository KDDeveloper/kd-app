import aboutGif from "../../resources/lotties/animation_640_kn4pvdxr.gif";
import PageHeading from "../../components/pageHeading";
import "./aboutPage.scss"


const AboutPage = () => {
    return(
        <>
            <div className="about-page-container">
                <div className="about-content">
                    <PageHeading lead="About" accent="me"/>

                    <div className="about-copy">
                        <p>I was always fond of creating things and solving problems.
                        Coding and programming never struck the light bulb in my head before like it did during the start of the pandemic,
                        I gave it a lot of thought and started my journey to become a web developer then on.</p>

                        <p>I really loved the idea of being able to create something just out of using a desk, laptop and my brain! I
                        have never before enjoyed learning and creating new things everyday as much as I have been enjoying it
                        since the start of this journey.</p>

                        <p>Many more and new mental and virtual challenges are awaited.</p>
                    </div>
                </div>

                <div className="about-img">
                    <img src={aboutGif} alt="Animation of a developer at a laptop"/>
                </div>
            </div>
        </>
    )
}

export default AboutPage
