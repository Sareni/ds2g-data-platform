import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

//import Payments from './Payments';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Documentation from './Documentation';
import Pricing from './Pricing';
import Projects from './Projects';
import Signup from './Signup';
import SupportForm from './SupportForm';
import Login from './Login';
import Account from './Account';
import SurveyNew from './surveys/SurveyNew';
import Preferences from './Preferences';

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return ( // <Payments />
            <BrowserRouter>
                <div>
                    
                    <Header />
                    <div className="">
                        <Route exact path='/' component={Landing}/>
                        <Route exact path='/dashboard' component={Dashboard}/>
                        <Route exact path='/documentation' component={Documentation}/>
                        <Route exact path='/pricing' component={Pricing}/>
                        <Route exact path='/projects' component={Projects}/>
                        <Route exact path='/preferences' component={Preferences}/>
                        <Route exact path='/signup' component={Signup}/>
                        <Route exact path='/support' component={SupportForm}/>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/account' component={Account}/>
                        <Route exact path='/surveys/new' component={SurveyNew}/>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default connect(null, actions)(App);