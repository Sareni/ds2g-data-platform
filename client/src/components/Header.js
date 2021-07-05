import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css';
import * as actions from '../actions';

class Header extends Component {
    componentDidUpdate() {
        let elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {inDuration: 300, outDuration: 225, coverTrigger: false, constrainWidth: false, alignment: 'right'});
    }

    renderContent() {
        switch (this.props.auth) {
            case null:
                return;

            case false:
                return [
                    <li><Link to="/documentation">Dokumentation</Link></li>,
                    <li><Link to="/pricing">Preise</Link></li>,
                    <li><Link to="/projects">Projekte</Link></li>,
                    <li><div style={{ width: '50px', height: '1px' }}></div></li>,
                    <li><Link to="/signup">Registrieren</Link></li>,
                    <li><Link to="/login">Login</Link></li>
                    
                ]; //<li><a href='/auth/google'>Login</a></li>

            default:
                return [
                    <li><Link to="/documentation">Dokumentation</Link></li>,
                    <li><Link to="/pricing">Preise</Link></li>,
                    <li><Link to="/projects">Projekte</Link></li>,
                    <li key='2'><div style={{width: '50px', height: '1px'}}></div></li>,
                    <li><a href='/preferences'><i className="material-icons" style={{height: '51px', lineHeight: '51px'}}>build</i></a></li>,
                    <li><a href="#!"><i className="material-icons" style={{height: '51px', lineHeight: '51px'}}>account_circle</i></a></li>,
                    <li><a href="/api/logout"><i className="material-icons" style={{height: '51px', lineHeight: '51px'}}>logout</i></a></li>,
                ];
        }
    }

    /*

                    <ul id="dropdown1" className="dropdown-content">
                        <li><a href='/account' className='blue-grey-text'><i className="material-icons left" style={{marginRight: '19px', marginLeft: '0px'}}>info</i>Account</a></li>
                        <li className="divider"></li>
                        <li><a href='#!' className='blue-grey-text'><span style={{fontWeight: 'bolt', marginRight: '25px', marginLeft: '0px'}}>{ this.props.auth.credits }</span>Credits</a></li>
                    </ul>,
                    <li><a className="dropdown-trigger" href="#!" data-target="dropdown1"><i className="material-icons">account_circle</i></a></li>,
                    
    */

    render() { // <i className="material-icons left">data_usage</i> track-anything
        return (
            <nav className='blue-grey' style={{ height: '51px', lineHeight: '51px'}}>
                <div className='nav-wrapper container'>
                    <Link
                            to={ this.props.auth ? '/dashboard' : '/' }
                            className='left'
                        >
                            <div className='white-text' style={{lineHeight: '16px', paddingBottom: '4px'}}>
                                <span style={{fontSize: '26px', lineHeight: '30px', letterSpacing: '10px'}}>DS2G</span><br />
                                Data Platform
                            </div>
                        </Link>
                    <ul className='right'>
                        { this.renderContent() }
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps, actions)(Header);