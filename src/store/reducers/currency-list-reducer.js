import {
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_DONE,
    GET_CURRENCY_LIST_ERROR
} from '../types';
import moment from "moment";

const INITIAL_STATE = {
    currencyList: {},
    hasError: false,
    isLoading: false,
    expiresOn: null
};

const currencyListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CURRENCY_LIST:
            return {
                ...state,
                hasError: false,
                isLoading: true
            };
        case GET_CURRENCY_LIST_DONE:
            return {
                ...state,
                currencyList: action.data,
                isLoading: false,
                expiresOn: moment().add(1, 'hour')
            };
        case GET_CURRENCY_LIST_ERROR:
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
