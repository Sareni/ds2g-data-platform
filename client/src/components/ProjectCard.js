import React from 'react';
import testImg from './images/bg_demo.png';

const ProjectCard = () => {
    return (
        <div class="col s12 m6 l4">
            <div class="card">
                <div class="card-image">
                    <img src={ testImg } />
                    <span class="card-title">Card Title</span>
                </div>
                <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
                </div>
                <div class="card-action">
                <a href="#" class='blue-grey-text'>Show more ...</a>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;