import {
    SET_BASE_CURRENCY
} from '../types';

const INITIAL_STATE = 'USD';

const baseCurrencyReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_BASE_CURRENCY:
            return action.currency;
        default:
            return state;
    }
};

export default baseCurrencyReducer;
