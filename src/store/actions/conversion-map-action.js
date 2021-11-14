import api from '../../api/currency';

import {
    GET_CONVERSION_MAP,
    GET_CONVERSION_MAP_DONE,
    GET_CONVERSION_MAP_ERROR
} from '../types';
const getConversionMap = () => (dispatch) => {
    dispatch({ type: GET_CONVERSION_MAP });
    return api.getConversionMap()
        .then((resp) => {
            if (resp.status === 200) {
                console.log(
                    'Successfully fetched the conversion map',
                );

                dispatch({ type: GET_CONVERSION_MAP_DONE, data: resp.data });
            } else {
                dispatch({ type: GET_CONVERSION_MAP_ERROR });
                console.error(
                    'An error occurred while fetching the conversion map',
                    { resp }
                );
            }
        })
        .catch((err) => {
            dispatch({ type: GET_CONVERSION_MAP_ERROR });
            console.error(
                'An unexpected error occurred while fetching the conversion map',
                err
            );
        });
};

export default getConversionMap;
