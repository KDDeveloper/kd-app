import "./projectsPage.scss";
import { GithubIcon } from "../../components/svgs";

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
        name:"Nuva",
        img:`${require("../../resources/images/nuvaSS.png")}`,
        link:"https://n-y-f.netlify.app",
        github:"https://github.com/KDDeveloper/new-nuva-app"
    }]
    return(
        <>
            <div className="projects-page-container">
                <h1>Projects</h1>
                <div className="projects-container">
                    {projects.map((project)=>{
                        return(
                            <div className="project">
                                <div className="project-img"><img src={project.img}/></div>
                                <div className="project-name"><h3>{project.name}</h3></div>
                                <div className="project-buttons">
                                    <div className="visit-btn"><a target="_blank" href={project.link}>Visit</a></div>
                                    {project.github && (
                                        <div className="github-btn"><a target="_blank" href={project.github}><GithubIcon/>Github</a></div>
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