import { FETCH_MESSAGE_DATA } from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_MESSAGE_DATA:
            return action.payload;
        default:
            return state;
    }
};