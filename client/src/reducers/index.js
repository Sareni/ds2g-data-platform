import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer'
import paymentDialogReducer from './paymentDialogReducer';
import accountDataReducer from './accountDataReducer';
import messageDataReducer from './messageDataReducer';
import messageDialogReducer from './messageDialogReducer';
import flashMessageReducer from './flashMessageReducer';
import shareDataReducer from './shareDataReducer';

export default combineReducers({
    auth: authReducer,
    form: reduxForm,
    surveys: surveysReducer,
    paymentDialog: paymentDialogReducer,
    accountData: accountDataReducer,
    messageData: messageDataReducer,
    messageDialog: messageDialogReducer,
    flashMessage: flashMessageReducer,
    shareData: shareDataReducer,
});