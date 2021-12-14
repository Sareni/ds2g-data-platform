import React, { Component } from 'react';
import axios from 'axios';

class Forum extends Component {
    constructor (props) {
        super(props);
        this.limit = 10;
        this.maxPageDisplay = 5;
        this.state = {
            blogEntries: [],
            blogEntryCount: 0,
            activePage: 0
        };
      }
    
    async getMessages(skip=0) {
       const res = await axios.get(`/api/forum?skip=${skip}&limit=${this.limit}`);
       this.setState({
            blogEntries: res.data.messages,
            blogEntryCount: res.data.count
       });
    }

    async componentDidMount() {
       await this.getMessages();
    }

    async changePage(page) {
        await this.getMessages(page*this.limit);
        this.setState({
            activePage: page
       });
     }

    renderContent() {
        const blogEntries = this.state.blogEntries.map((be) => {
            return (
                <a href={`/documentation/forum/article?id=${be.id}`} style={{ display: 'block', textDecoration: 'none', color: 'black', border: '1px solid rgba(0, 0, 0, 0.4)', padding: '10px', margin: '20px 0', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)'}}>
                    <div style={{ margin: '10px 0'}}>
                        {new Date(be.created).toLocaleDateString('de-AT')}
                    </div>
                    <div style={{ margin: '10px 0'}}>
                        <h5>{be.headline}</h5>
                    </div>
                    <div style={{ margin: '10px 0'}}>
                        {be.content}
                    </div>
                </a> 
            );
        });
        return blogEntries;
    }


    renderPagination() {
        // TODO refactor
        const pageTotalCount = Math.ceil(this.state.blogEntryCount/this.limit);
        let pageCount = 1;
        const prePostPages = Math.floor(this.maxPageDisplay/2);

        const pages = [];

        const prePages = prePostPages + Math.max(prePostPages + this.state.activePage + 1 - pageTotalCount, 0);

        for (let i = 0; i < prePages; i++) {
            const page = this.state.activePage - (prePages - i);
            if(page >= 0) {
                const pageHTML = <span style={{margin: '0 10px', cursor:'pointer'}} onClick={()=>this.changePage(page)}>{page+1}</span>
                pages.push(pageHTML);
                pageCount++;
            }
            if (pageCount >= this.maxPageDisplay) {
                break;
            }
        }

        pages.push(<span style={{margin: '0 10px', fontWeight: 'bold'}} onClick={()=>this.changePage(this.state.activePage)}>{this.state.activePage+1}</span>);

        for (let i = this.state.activePage + 1; i < pageTotalCount; i++) {
            if (pageCount >= this.maxPageDisplay) {
                break;
            }
            const page = i;
            const pageHTML = <span style={{margin: '0 10px', cursor:'pointer'}} onClick={()=>this.changePage(page)}>{page+1}</span>
            pages.push(pageHTML);
            pageCount++;
        }

        return (
            <div style={{textAlign:'center'}}>
                {pages}
            </div>
        )
    }

    render() {
        return (
            <div className='container'>
                <a href='/documentation/forum/add' class="btn-floating btn-large waves-effect waves-light blue-grey" style={{margin: '30px auto', display: 'block'}}><i class="material-icons">add</i></a>
                { this.renderContent() }
                { this.renderPagination() }
            </div>
        );
    }
}

export default Forum;