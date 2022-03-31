import "./projectsPage.scss";
import { GithubIcon } from "../../components/svgs";

const ProjectsPage = () =>{

    const projects = [{
        name:"Nuva",
        img:`${require("../../resources/images/nuvaSS.png")}`,
        link:"https://n-y-f.netlify.app",
        github:"https://github.com/KDDeveloper/new-nuva-app"
    },{
        name:"CRM",
        img:`${require("../../resources/images/crmSS.png")}`,
        link:"https://kd-crm.netlify.app/summary",
        github:"https://github.com/KDDeveloper/CRM-backend"
    },
    {
        name:"Todo App",
        img:`${require("../../resources/images/todoSS.png")}`,
        link:"https://kd-todo-notes.netlify.app/login",
        github:"https://github.com/KDDeveloper/todo-app-backend"
    },
    {
        name:"Money manager",
        img:`${require("../../resources/images/moneyManagerSS.png")}`,
        link:"https://kd-money-manager.netlify.app/home",
        github:"https://github.com/KDDeveloper/money-manager-backend"    
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
                                    <div className="github-btn"><a target="_blank" href={project.github}><GithubIcon/>Github</a></div>
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