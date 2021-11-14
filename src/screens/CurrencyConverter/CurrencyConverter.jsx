import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import { Formik } from "formik";
import styles from './CurrencyConvter.module.css';
import setBaseCurrency from "../../store/actions/base-currency-action";
import CurrencyConverterForm from "./partials/CurrencyConverterForm";

const {
    container,
    conversionResultStyle,
    baseCurrencyTextStyle,
} = styles;


const CurrencyConverter = () => {
    const dispatch = useDispatch();
    const [result, setResult] = useState({});
    const currencyList = useSelector(state => state.currencyList);
    const conversionMap = useSelector(state => _.get(state, 'conversionMap.data.rates', {}));
    const baseCurrency = useSelector(state => _.get(state, 'baseCurrency', 'USD'));
    const options = _.get(currencyList, 'currencyList', {});
    const handleBaseCurrency = (value) => {
        dispatch(setBaseCurrency(value));
    };

    const { amount, fromCurrency, value, toCurrency } = result;
    return (
        <div className={container}>
            <h1>Currency Converter</h1>
            <span className={baseCurrencyTextStyle}>{`Base Currency: ${baseCurrency}`}</span>
            <Formik
                initialValues={{ amount: 1, from: baseCurrency }}
                validate={values => {
                    const errors = {};
                    const amount = parseFloat(values.amount);
                    if (!amount || !_.isNumber(amount) || amount < 1) {
                        errors.amount = 'Invalid Amount';
                    }
                    if (_.isEmpty(values.to)) {
                        errors.to = 'Please select a currency';
                    }
                    return errors;
                }}
                onSubmit={({ from, amount, to }, { setSubmitting }) => {
                    const fromValue = conversionMap[from];
                    const toValue = conversionMap[to];
                    const usdValue = amount / fromValue;
                    const convertedValue = usdValue * toValue;
                    setResult({
                        value: convertedValue.toFixed(2),
                        fromCurrency: from,
                        toCurrency: to,
                        amount
                    });
                    setSubmitting(false);
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                      submitCount
                  }) => (
                    <CurrencyConverterForm
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleBaseCurrency={handleBaseCurrency}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                    options={options}
                    setFieldValue={setFieldValue}
                    isSubmitting={isSubmitting}
                    submitCount={submitCount}
                    />
                )}
            </Formik>
            {!_.isEmpty(result) && <span data-testid="result-text"
                className={conversionResultStyle}>{`${amount} ${options[fromCurrency]} = ${value} ${options[toCurrency]}`}</span>}
        </div>
    );
};


export default CurrencyConverter;
