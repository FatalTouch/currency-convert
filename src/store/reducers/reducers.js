import { combineReducers } from "redux";
import currencyList from "./currency-list-reducer";
import conversionMap from './conversion-map-reducer';
import baseCurrency from "./base-currency-reducer";

export default combineReducers({
    currencyList,
    conversionMap,
    baseCurrency
});
