import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from "antd";
import getSymbolFromCurrency from "currency-symbol-map";
import { Select } from "formik-antd";
import { SwapOutlined } from "@ant-design/icons";
import styles from './CurrencyConverterForm.module.css';


const { Option } = Select;


const {
    formFieldStyle,
    formContainer,
    buttonStyle,
    formFieldsContainer,
    marginStyle,
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

const CurrencyConverterForm = ({
                                   handleSubmit,
                                   values,
                                   handleChange,
                                   handleBlur,
                                   errors,
                                   touched,
                                   submitCount,
                                   handleBaseCurrency,
                                   options,
                                   setFieldValue,
                                   isSubmitting
                               }) => {

    const transformedOptions = [];

    Object.keys(options).forEach((key) => {
        transformedOptions.push({ value: key, label: options[key] });
    });
    const selectOptions = transformedOptions.map(item => {
        return <Option key={item.value} value={item.value}>{`${item.value} - ${item.label}`}</Option>
    });

    return (
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
    );
};

CurrencyConverterForm.propTypes = {
    submitCount: PropTypes.number.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    handleBaseCurrency: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired
};

export default CurrencyConverterForm;
