import "./projectsPage.scss";
import { GithubIcon } from "../../components/svgs";
import PageHeading from "../../components/pageHeading";

const ProjectsPage = () =>{

    const projects = [{
        name:"Onference",
        img:`${require("../../resources/images/onferenceSS.png")}`,
        link:"https://onference.in"
    },{
        name:"EPIX Cinemas",
        img:`${require("../../resources/images/epixSS.png")}`,
        link:"https://www.epixcinemas.com/"
    },{
        name:"Cryptonpay",
        img:`${require("../../resources/images/cryptonpaySS.png")}`,
        link:"https://cryptonpay.com/home-merchant"
    },{
        name:"AHA Smart Homes",
        img:`${require("../../resources/images/ahaLogo.png")}`,
        link:"https://www.ahasmarthomes.com/",
        // the logo is white lettering baked onto a #121212 block, so this card
        // gets a matching panel instead of the default white one
        dark:true
    },{
        name:"Nuva",
        img:`${require("../../resources/images/nuvaSS.png")}`,
        link:"https://n-y-f.netlify.app"
    }]
    return(
        <>
            <div className="projects-page-container">
                <PageHeading lead="My" accent="Projects"/>
                <div className="projects-container">
                    {projects.map((project)=>{
                        return(
                            <div className="project" key={project.name}>
                                <div className={project.dark ? "project-img project-img-dark" : "project-img"}><img src={project.img} alt={`${project.name} website`}/></div>
                                <div className="project-name"><h3>{project.name}</h3></div>
                                {project.description && (
                                    <p className="project-description">{project.description}</p>
                                )}
                                {project.tags && (
                                    <ul className="project-tags">
                                        {project.tags.map(tag => <li key={tag}>{tag}</li>)}
                                    </ul>
                                )}
                                <div className="project-buttons">
                                    {/* this link carries a ::after that covers the whole card, so the
                                        card is the click target while the markup stays one labelled
                                        link rather than a link nested inside a link */}
                                    <div className="visit-btn">
                                        <a target="_blank" rel="noreferrer" href={project.link}
                                           aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit</a>
                                    </div>
                                    {project.github && (
                                        <div className="github-btn"><a target="_blank" rel="noreferrer" href={project.github}
                                           aria-label={`${project.name} on Github (opens in a new tab)`}><GithubIcon/>Github</a></div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default ProjectsPage