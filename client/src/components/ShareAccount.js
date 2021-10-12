import React, { Component } from 'react';
import axios from 'axios';
import M from 'materialize-css';
import FormPreloader from './FormPreloader';


class ShareAccount extends Component {
    constructor(props) {
        super(props);

        this.selectRef = React.createRef();

        this.state = {
            role: '',
            prevRole: '',
            propRole: '',
            isEditable: false,
            status: 'ready'
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newState = {};
        if (prevState.propRole !== nextProps.role) {
            newState.role = nextProps.role;
            newState.prevRole = nextProps.role;
            newState.propRole = nextProps.role;
        }
        return newState;
      }

    componentDidUpdate() {
        if (this.state.isEditable) {
            M.FormSelect.init(this.selectRef.current, {inDuration: 300, outDuration: 225, coverTrigger: false, constrainWidth: false, alignment: 'left'});
        }
    }

    edit() {
        this.setState({
            isEditable: true,
        });
    }

    cancel() {
        this.setState({
            isEditable: false,
            role: this.state.prevRole,
        });
    }

    async delete() {
        this.setState({
            isEditable: false,
            status: 'waiting'
        });
        const res = await axios.delete(`/api/subaccount/${this.props.email}`);
        this.setState({
            status: 'invisible'
        });
    }

    async save() {
        this.setState({
            isEditable: false,
            prevRole: this.state.role,
            status: 'waiting'
        });
        const res = await axios.put(`/api/subaccount`, {email: this.props.email, role: this.state.role });
        this.setState({
            status: 'ready'
        });
    }

    handleSelectChange(event) {
        this.setState({
            role: event.target.value
        });
    }

    mapRole(role) {
        switch(role) {
            case 'subuser': return 'User';
            case 'subadmin': return 'Admin';
            default: return 'no role';
        }
    }

    renderMenu(){
        if (this.state.status === 'ready') {
            return (
                <button style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)'}} onClick={()=>this.edit()}><i className='material-icons blue-grey-text'>create</i></button>
            );
        }
        return (
            <FormPreloader></FormPreloader>
        );
    }

    render() {
        if (this.state.status === 'invisible') {
            return '';
        } 
        return (
                <div style={{margin: '20px 0'}}>
                <div style={{ display: this.state.isEditable? 'flex' : 'none', height: '45px'}}>
                    <input type='text' className='email' value={this.props.email} style={{ border: 'none'}} readOnly={true}/>
                    <select ref={this.selectRef} onChange={(event) => this.handleSelectChange(event)}>
                            <option value="subuser" selected={this.state.role === 'subuser'}>User</option>
                            <option value="subadmin" selected={this.state.role === 'subadmin'}>Admin</option>
                    </select>
                    <div>
                        <button style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)', margin: '11px 20px 0px 0px'}} onClick={()=>this.save()}><i className='material-icons blue-grey-text'>save</i></button>
                        <button style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)', margin: '11px 20px 0px 0px'}} onClick={()=>this.cancel()}><i className='material-icons blue-grey-text'>cancel</i></button>
                        <button style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)', margin: '11px 20px 0px 0px'}} onClick={()=>this.delete()}><i className='material-icons blue-grey-text'>delete</i></button>
                    </div>
                </div>
                <div style={{ display: this.state.isEditable? 'none' : 'flex', height: '45px', padding: '11px 0 5px 0', fontSize: '16px'}}>
                    <div>{this.props.email}</div>
                    <div>{this.mapRole(this.state.role)}</div>
                    <div>{this.renderMenu()}</div>
                </div>
            </div>
            );
    }
}  


export default ShareAccount;
