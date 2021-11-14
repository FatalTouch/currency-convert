import {
    GET_CONVERSION_MAP,
    GET_CONVERSION_MAP_DONE,
    GET_CONVERSION_MAP_ERROR
} from '../types';
import moment from "moment";

const INITIAL_STATE = {
    data: [],
    hasError: false,
    isLoading: false,
    expiresOn: null
};

const currencyListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CONVERSION_MAP:
            return {
                ...state,
                hasError: false,
                isLoading: true
            };
        case GET_CONVERSION_MAP_DONE:
            return {
                ...state,
                data: action.data,
                isLoading: false,
                expiresOn: moment().add(1, 'hour')
            };
        case GET_CONVERSION_MAP_ERROR:
            return {
                ...state,
                hasError: true,
                isLoading: false
            };
        default:
            return state;
    }
};


export default currencyListReducer;
