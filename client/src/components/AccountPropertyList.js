import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccountData } from '../actions';

class AccountDataList extends Component {
    componentDidMount() {
        this.props.fetchAccountData();
    }

    renderAccountData() {
        return this.props.accountData.map(data => { // key={survey._id}
            return (
                <div className='card white' style={{margin: '30px 0px'}}>
                    <div className='card-content'>
                        <p style={{color: 'grey'}}>{ data.title }</p>
                        <span className='card-title'>{data.value}</span>
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container">
                <div>
                    {this.renderAccountData()}
                </div>
            </div>
        );
    }
}

function mapStateToProps({ accountData }) {
    return { accountData };
}

export default connect(mapStateToProps, { fetchAccountData })(AccountDataList);