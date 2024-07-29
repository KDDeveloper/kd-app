import ContactPage  from "../src/pages/contactPage/contactPage";
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import './App.scss';
import Navbar from './components/navbar';
import AboutPage from './pages/aboutPage/aboutPage';
import HomePage from './pages/homePage/homePage';
import ProjectsPage from './pages/projectsPage/projectsPage';
import SkillsPage from './pages/skillsPage/skillsPage';
import {Helmet} from "react-helmet";
function App() {
  
  return (
    <div className="App">
      <Helmet>
        <title>KD Web Developer</title>
      </Helmet>
      <Router>
        <Routes>
          // <Route path="/" element={<Navigate to="/kd/home"/>} />
          <Route path="/" element={<Navbar/>} >
            <Route index element={<HomePage/>} />
            <Route path="about" element={<AboutPage/>} />
            <Route path="skills" element={<SkillsPage/>} />
            <Route path="projects" element={<ProjectsPage/>} />
            <Route path="contact" element={<ContactPage/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
