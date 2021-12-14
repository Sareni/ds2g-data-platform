import React, { Component } from 'react';
import axios from 'axios';

class ForumArticle extends Component {
    constructor (props) {
        super(props);
        const queryParams = props.location.search && props.location.search.length && props.location.search;
        const idRegex =  /id=([0-9]+)/;
        this.id = queryParams.match(idRegex)[1];
        this.state = {
            mainArticle: {},
            subArticles: []
        }
    }
    
    async getArticleMessages() {
       const res = await axios.get(`/api/forum/article?id=${this.id}`);
       this.setState({
            mainArticle: res.data.mainArticle || {},
            subArticles: res.data.subArticles  || []
       });
    }

    async componentDidMount() {
       await this.getArticleMessages();
    }


    renderContent() {
        const main = <div style={{ display: 'block', textDecoration: 'none', color: 'black', border: '1px solid rgba(0, 0, 0, 0.4)', padding: '10px', margin: '20px 0', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)'}}>
                        <div style={{ margin: '10px 0'}}>
                            {new Date(this.state.mainArticle.created).toLocaleDateString('de-AT')}
                        </div>
                        <div style={{ margin: '10px 0'}}>
                            <h5>{this.state.mainArticle.headline}</h5>
                        </div>
                        <div style={{ margin: '10px 0'}}>
                            {this.state.mainArticle.content}
                        </div>
                    </div> ;

        const subs = this.state.subArticles.map((sm) => {
            return (
                <div style={{ display: 'block', textDecoration: 'none', color: 'black', border: '1px solid rgba(0, 0, 0, 0.4)', padding: '10px', margin: '20px 0 20px 100px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)'}}>
                    <div style={{ margin: '10px 0'}}>
                        {new Date(sm.created).toLocaleDateString('de-AT')}
                    </div>
                    <div style={{ margin: '10px 0'}}>
                        <h5>{sm.headline}</h5>
                    </div>
                    <div style={{ margin: '10px 0'}}>
                        {sm.content}
                    </div>
                </div> 
            );
        });
        return [main, ...subs];
    }

    render() {
        if(this.state.mainArticle && this.state.mainArticle.headline) {
            return (
                <div className='container'>
                    { this.renderContent() }
                    <a href={`/documentation/forum/add?id=${this.id}`} class="btn-floating btn-large waves-effect waves-light blue-grey" style={{margin: '30px auto', display: 'block'}}><i class="material-icons">add</i></a>
                </div>
            );
        }
        return 'Artikel kann nicht geöffnet werden';
    }
}

export default ForumArticle;