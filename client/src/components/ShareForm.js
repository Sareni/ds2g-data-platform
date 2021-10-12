import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchShareData } from '../actions';
import CustomForm from './CustomForm';

import M from 'materialize-css';
import ShareAccount from './ShareAccount';

// https://codepen.io/vaskopetrov/pen/amxvrY



// TODO USE Materialize SWITCHES INSTEAD

class ShareForm extends Component {
    constructor(props) {
        super(props);

        this.action = '/api/subaccount';
        this.submitButton = {
            icon: 'mail',
            text: 'Einladen'
        };
        this.cancelButton = true;
        this.selectRef = React.createRef();
    }

    componentDidMount() {
        this.props.fetchShareData();
    }

    componentDidUpdate() {
        M.FormSelect.init(this.selectRef.current, {inDuration: 300, outDuration: 225, coverTrigger: false, constrainWidth: false, alignment: 'left'});
    }

    renderShareList() {
        if (this.props.shareData /*&& this.props.shareData.lenght > 0*/) {
            return (
                <div className='propertiesShareAccountBox'>
                    {this.props.shareData.map((subAccount) => {
                        return <ShareAccount email={subAccount.email} role={subAccount.role}></ShareAccount>
                    })}
                </div>
            )
        } else {
            return (
                <div className='propertiesShareAccountBox'>
                    <i>Ihre persönliche Datenquelle wurde noch mit niemandem geteilt.</i>
                </div>
            )
        }
    }

    render() {
        return (
        <div>
            <div>
                {this.renderShareList()}
            </div>
            <CustomForm action={this.action} submitButton={this.submitButton} cancelButton={this.cancelButton}>
                <div class="row">
                        <div class="input-field col s12">
                        <input id="email" name="email" type="email" class="validate" required />
                        <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <select name='role' ref={this.selectRef} >
                            <option value="subuser" selected>User</option>
                            <option value="subadmin">Admin</option>
                        </select>
                        <label>Rolle</label>
                        </div>
                    </div>
            </CustomForm>
        </div>
        );
    }
}  

function mapStateToProps({ shareData }) {
    return { shareData };
}
export default connect(mapStateToProps, { fetchShareData })(ShareForm);
