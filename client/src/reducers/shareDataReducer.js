import { FETCH_SHARE_DATA } from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_SHARE_DATA:
            return action.payload;
        default:
            return state;
    }
};