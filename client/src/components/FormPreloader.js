import React from 'react';

const FormPreloader = (props) => {
    return (
        <div style={{ display: 'inline-block', width: '100px' }} className={props.className}>
            <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>
            </div>
        </div>
        
    );
};

export default FormPreloader;