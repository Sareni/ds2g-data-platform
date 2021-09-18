import React from 'react';
import testImg from './images/bg_demo.png';
import ProjectCard from './ProjectCard';

const Projects = () => {
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h4>
                Projekte
            </h4>
            <div class="row">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </div>
    );
};

export default Projects;