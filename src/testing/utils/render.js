// test-utils.jsx
import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
// reducers
import currencyList from '../../store/reducers/currency-list-reducer';
import conversionMap from '../../store/reducers/conversion-map-reducer';
import baseCurrency from "../../store/reducers/base-currency-reducer";

function render(
    ui,
    {
        preloadedState,
        store = configureStore({ reducer: { currencyList, conversionMap, baseCurrency }, preloadedState }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>
    }

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }
