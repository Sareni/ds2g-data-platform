import React from 'react';
import testImg from './test.jpg';

const DocumentationCard = () => {
    return (
        <div class="col s3 m3 l3">
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
                <a href="#" class='blue-grey-text'>
                    Open
                    <i class="material-icons" style={{verticalAlign: 'top', fontSize: '22px'}}>navigate_next</i>
                </a>
                </div>
            </div>
        </div>
    );
};

export default DocumentationCard;