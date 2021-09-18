import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS, SHOW_PAYMENT_DIALOG, HIDE_PAYMENT_DIALOG, FETCH_ACCOUNT_DATA, FETCH_MESSAGE_DATA, SHOW_MESSAGE_DIALOG, HIDE_MESSAGE_DIALOG } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    return dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
    const res = await axios.post('/api/stripe', token);
    // show error
    // hide payment dialog
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
    const res = await axios.post('/api/surveys', values);
    history.push('/dashboard'); // /surveys
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
    const res = await axios.get('/api/surveys');

    dispatch({ type: FETCH_SURVEYS, payload: res.data });
};

export const fetchAccountData = () => async dispatch => {
    const res = await axios.get('/api/accountDetails');

    dispatch({ type: FETCH_ACCOUNT_DATA, payload: res.data });
};

export const fetchMessageData = () => async dispatch => {
    const res = await axios.get('/api/messageDetails');
    console.log('message', res);

    return dispatch({ type: FETCH_MESSAGE_DATA, payload: res.data });
};

export const showPaymentDialog = () => dispatch => {
    dispatch({ type: SHOW_PAYMENT_DIALOG, payload: {} });
};

export const hidePaymentDialog = () => dispatch => {
    dispatch({ type: HIDE_PAYMENT_DIALOG, payload: {} });
};

export const showMessageDialog = () => dispatch => {
    dispatch({ type: SHOW_MESSAGE_DIALOG, payload: {} });
};

export const hideMessageDialog = () => dispatch => {
    dispatch({ type: HIDE_MESSAGE_DIALOG, payload: {} });
};

export const fetchUserAndMessageData = () => async dispatch => {
    const user = await dispatch(fetchUser());
    if (user.payload) {
        await dispatch(fetchMessageData());
    };
};
