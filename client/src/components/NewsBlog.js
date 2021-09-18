import React, { Component } from 'react';
import axios from 'axios';

class NewsBlog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            blogEntries: []
        };
      }

    async componentDidMount () {
       const res = await axios.get('/api/messages');
       this.setState({
        blogEntries: res.data.messages
       })
    }

    renderContent() {
        const blogEntries = this.state.blogEntries.map((be) => {
            return (
                <div style={{ border: '1px solid rgba(0, 0, 0, 0.4)', padding: '10px', margin: '20px 0', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)'}}>
                    <div style={{ margin: '10px 0'}}>
                        Neuigkeit vom {be.releaseDate}
                    </div>
                    <div style={{ margin: '10px 0'}}>
                        {be.content}
                    </div>
                </div> 
            );
        });
        return blogEntries;
    }

    render() {
        return (
            <div className='container'>
                { this.renderContent() }
            </div>
        );
    }
}

export default NewsBlog;