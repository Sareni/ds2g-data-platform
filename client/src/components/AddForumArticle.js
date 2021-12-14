import React from 'react';
import AddForumArticleForm from './AddForumArticleForm';

const NewPassword = (props) => {
    
    const queryParams = props.location.search && props.location.search.length && props.location.search;
    const idRegex =  /id=([0-9]+)/;
    const matches = queryParams.match(idRegex);
    const id = matches ? matches[1] : 0;

    return (
        <div style={{ textAlign: 'center' }}>
            <h4>
            Neuen Forumsbeitrag erstellen
            </h4>
            <AddForumArticleForm rootArticleId={id}/>
        </div>
    );
};

export default NewPassword;