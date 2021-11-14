import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SwapOutlined } from "@ant-design/icons";
import _ from 'lodash';
import { Formik } from "formik";
import { Select } from 'formik-antd';
import { Input, Button } from 'antd';
import getSymbolFromCurrency from 'currency-symbol-map'
import styles from './CurrencyConvter.module.css';
import setBaseCurrency from "../../store/actions/base-currency-action";

const { Option } = Select;

const {
    container,
    formFieldStyle,
    formContainer,
    buttonStyle,
    conversionResultStyle,
    formFieldsContainer,
    marginStyle,
    baseCurrencyTextStyle,
    buttonsContainer,
    errorTextStyle
} = styles;

const handleSwapClick = ({ setFieldValue, from, to }) => {
    setFieldValue('from', to);
    setFieldValue('to', from);
};

const handleSelectSearch = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0


const CurrencyConverter = () => {
    const dispatch = useDispatch();
    const [result, setResult] = useState({});
    const currencyList = useSelector(state => state.currencyList);
    const conversionMap = useSelector(state => _.get(state, 'conversionMap.data.rates', {}));
    const baseCurrency = useSelector(state => _.get(state, 'baseCurrency', 'USD'));
    const options = _.get(currencyList, 'currencyList', {});
    const transformedOptions = [];

    Object.keys(options).forEach((key) => {
        transformedOptions.push({ value: key, label: options[key] });
    });
    const selectOptions = transformedOptions.map(item => {
        return <Option key={item.value} value={item.value}>{`${item.value} - ${item.label}`}</Option>
    });

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
                      /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit} className={formContainer}>
                        <div className={formFieldsContainer}>
                            <div className={formFieldStyle}>
                                <Input
                                    prefix={getSymbolFromCurrency(values.from)}
                                    type="text"
                                    name="amount"
                                    placeholder="Amount"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.amount}
                                />
                                {errors.amount && touched.amount &&
                                <span className={errorTextStyle}>{errors.amount}</span>}
                            </div>
                            <div className={formFieldStyle}>
                                <Select
                                    data-testid="select-from"
                                    style={{ width: '100%' }}
                                    name="from"
                                    showSearch
                                    placeholder="From"
                                    filterOption={handleSelectSearch}
                                >
                                    {selectOptions}
                                </Select>
                            </div>
                            <Button
                                className={marginStyle}
                                shape="circle"
                                onClick={() => handleSwapClick({ setFieldValue, to: values.to, from: values.from })}
                                icon={<SwapOutlined />}
                            />
                            <div className={formFieldStyle}>
                                <Select
                                    data-testid="select-to"
                                    style={{ width: '100%' }}
                                    name="to"
                                    showSearch
                                    placeholder="To"
                                    filterOption={handleSelectSearch}
                                >
                                    {selectOptions}
                                </Select>
                                {errors.to && submitCount > 0 &&
                                <span className={errorTextStyle}>{errors.to}</span>}
                            </div>
                        </div>
                        <div className={buttonsContainer}>
                            <Button data-testid="convert-button" type="primary" className={buttonStyle} disabled={isSubmitting}
                                    onClick={handleSubmit}>
                                Convert
                            </Button>
                            <Button data-testid="base-button" className={marginStyle} disabled={isSubmitting}
                                    onClick={() => handleBaseCurrency(values.from)}>
                                Set as base currency
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
            {!_.isEmpty(result) && <span data-testid="result-text"
                className={conversionResultStyle}>{`${amount} ${options[fromCurrency]} = ${value} ${options[toCurrency]}`}</span>}
        </div>
    );
};


export default CurrencyConverter;
