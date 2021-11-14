import api from '../../api/currency';

import {
    GET_CURRENCY_LIST_ERROR,
    GET_CURRENCY_LIST_DONE,
    GET_CURRENCY_LIST
} from '../types';

const getCurrencyList = () => (dispatch) => {
    dispatch({ type: GET_CURRENCY_LIST });
    return api.getCurrencyList()
        .then((resp) => {
            if (resp.status === 200) {
                console.log(
                    'Successfully fetched the currency list',
                );

                dispatch({ type: GET_CURRENCY_LIST_DONE, data: resp.data });
            } else {
                dispatch({ type: GET_CURRENCY_LIST_ERROR });
                console.error(
                    'An error occurred while fetching the currency list',
                    { resp }
                );
            }
        })
        .catch((err) => {
            dispatch({ type: GET_CURRENCY_LIST_ERROR });
            console.error(
                'An unexpected error occurred while fetching the currency list',
                err
            );
        });
};

export default getCurrencyList;
