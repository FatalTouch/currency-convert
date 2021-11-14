import React, { useEffect } from 'react';
// screens
import CurrencyConverter from "./screens/CurrencyConverter/CurrencyConverter";
import { Route } from "react-router-dom";
import { Router as RouterComp } from 'react-router';
import { createBrowserHistory } from 'history';
import { useDispatch, useSelector } from "react-redux";
import getCurrencyList from "./store/actions/currency-list-action";
import getConversionMap from "./store/actions/conversion-map-action";
import _ from "lodash";
import moment from "moment";

const history = createBrowserHistory();


const Router = () => {
    const dispatch = useDispatch();
    const currencyListExpiration = useSelector(state => _.get(state, 'currencyList.expiresOn', null));
    const conversionMapExpiration = useSelector(state => _.get(state, 'conversionMap.expiresOn', null));

    useEffect(() => {
        if (!currencyListExpiration || moment().isAfter(currencyListExpiration)) {
            dispatch(getCurrencyList());
        } else {
            console.log('currency list is still valid');
        }
        if (!conversionMapExpiration || moment().isAfter(conversionMapExpiration)) {
            dispatch(getConversionMap());
        } else {
            console.log('conversion map is still valid');
        }
    }, [conversionMapExpiration, currencyListExpiration, dispatch]);
    return (
        <RouterComp history={history}>
            <Route path="/" component={CurrencyConverter} />
        </RouterComp>
    );
};

export default Router;
