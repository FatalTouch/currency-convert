/**
 * Avatar Action that sets the active avatar
 */

import { SET_BASE_CURRENCY } from '../types';

const setBaseCurrency = (currency) => ({
    type: SET_BASE_CURRENCY,
    currency
});

export default setBaseCurrency;
