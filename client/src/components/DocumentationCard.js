import React from 'react';

import testImg from './images/bg_demo.png';

const DocumentationCard = (props) => {
    return (
        <div class="col s3 m3 l3">
            <div class="card">
                <div class="card-image">
                    <img src={ props.bgImg } />
                    <span class="card-title">{ props.title }</span>
                </div>
                <div class="card-content">
                <p>{ props.content }</p>
                </div>
                <div class="card-action">
                <a href={ props.href } class='blue-grey-text'>
                    Öffnen
                    <i class="material-icons" style={{verticalAlign: 'top', fontSize: '22px'}}>navigate_next</i>
                </a>
                </div>
            </div>
        </div>
    );
};

export default DocumentationCard;