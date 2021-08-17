import React from 'react';
import testImg from './images/bg_demo.png';
import ProjectCard from './ProjectCard';

const Projects = () => {
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h1>
            Projects
            </h1>
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