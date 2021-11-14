import { screen, act, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../testing/utils/render';
import CurrencyConverter from './CurrencyConverter';
import App from '../../App';
import { rest } from "msw";
import { setupServer } from 'msw/node';
import mockCurrencies from "../../testing/assets/mockCurrencies";
import mockExchangeRateMap from "../../testing/assets/mockExchangeRateMap";
//

const server = setupServer(
    rest.get('https://openexchangerates.org/api/currencies.json', (req, res, ctx) => {
        return res(ctx.json(mockCurrencies))
    }),
    rest.get('https://openexchangerates.org/api/latest.json', (req, res, ctx) => {
        return res(ctx.json(mockExchangeRateMap))
    }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders currency converter text and result text is not visible', () => {
    act(() => {
        render(<CurrencyConverter />);
    });
    const textElement = screen.getByText(/Currency Converter/i);
    expect(textElement).toBeInTheDocument();
    const resultTextElement = screen.queryByTestId("result-text");
    expect(resultTextElement).toBeNull();
});

test('conversion result is visible after clicking convert', async () => {
    act(() => {
        render(<App />);
    });

    await waitFor(async () => {
        const elt = screen.getByTestId('select-to').firstElementChild;
        fireEvent.mouseDown(elt);
        fireEvent.click(screen.getByText(/AMD/i));
    });

    await waitFor(async () => {
        fireEvent.click(screen.queryByTestId("convert-button"));
    });

    const resultTextElement = screen.getByTestId("result-text");
    expect(resultTextElement).toBeInTheDocument();
});

test('expect error message to show up in case we try to convert without select the To currency', async () => {
    act(() => {
        render(<App />);
    });

    await waitFor(async () => {
        fireEvent.click(screen.queryByTestId("convert-button"));
    });

    const errorElement = screen.getByText("Please select a currency");
    expect(errorElement).toBeInTheDocument();
});

test('expect base currency to be set correctly', async () => {
    act(() => {
        render(<App />);
    });

    await waitFor(async () => {
        const elt = screen.getByTestId('select-from').firstElementChild;
        fireEvent.mouseDown(elt);
        fireEvent.click(screen.getByText(/ALL/i));
    });
    await waitFor(async () => {
        fireEvent.click(screen.queryByTestId("base-button"));
    })

    const baseCurrencyText = screen.getByText("Base Currency: ALL");
    expect(baseCurrencyText).toBeInTheDocument();
});
