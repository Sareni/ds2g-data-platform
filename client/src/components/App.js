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
import AdminPanel from './AdminPanel';
import Preferences from './Preferences';
import NewsBlog from './NewsBlog';
import Forum from './Forum';
import ForumArticle from './ForumArticle';
import AddForumArticle from './AddForumArticle';
import ResetPassword from './ResetPassword';
import ResetPasswordInfo from './ResetPasswordInfo';
import NewPassword from './NewPassword';
import NewPasswordInfo from './NewPasswordInfo';
import SupportInfo from './SupportInfo';
import VerifyEmailInfo from './VerifyEMailInfo';

class App extends Component {
    componentDidMount() {
        //this.props.fetchUser();
        //this.props.fetchMessageData();
        this.props.fetchUserAndMessageData();
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
                        <Route path='/admin' component={AdminPanel}/>
                        <Route path='/preferences' component={Preferences}/>
                        <Route exact path='/signup' component={Signup}/>
                        <Route exact path='/support' component={SupportForm}/>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/account' component={Account}/>
                        <Route exact path='/surveys/new' component={SurveyNew}/>
                        <Route exact path='/documentation/forum' component={Forum}/>
                        <Route exact path='/documentation/forum/article' component={ForumArticle}/>
                        <Route exact path='/documentation/forum/add' component={AddForumArticle}/>
                        <Route exact path='/documentation/news-blog' component={NewsBlog}/>
                        <Route exact path='/resetpassword' component={ResetPassword}/>
                        <Route exact path='/resetpasswordinfo' component={ResetPasswordInfo}/>
                        <Route exact path='/newpassword' component={NewPassword}/>
                        <Route exact path='/newpasswordinfo' component={NewPasswordInfo}/>
                        <Route exact path='/supportinfo' component={SupportInfo}/>
                        <Route exact path='/verifyemailinfo' component={VerifyEmailInfo}/>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default connect(null, actions)(App);