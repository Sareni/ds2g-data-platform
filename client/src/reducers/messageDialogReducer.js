import { SHOW_MESSAGE_DIALOG, HIDE_MESSAGE_DIALOG } from '../actions/types';

export default function(state = {visible: true}, action) {
    switch (action.type) {
        case SHOW_MESSAGE_DIALOG:
            return { visible: true };
        case HIDE_MESSAGE_DIALOG:
            return { visible: false };
        default:
            return state;
    }
};