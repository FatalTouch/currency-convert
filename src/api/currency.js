import axios from 'axios';
import retryPlugin from 'axios-retry';

const { CancelToken } = axios;

const REQUEST_TIMEOUT = 10000 // in ms

export const httpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH'
};

const apiUrl = 'https://openexchangerates.org/api';


const axiosDefault = axios.create({});
const axiosWithRetry = axios.create({});

retryPlugin(axiosWithRetry, {
    retries: 3,
    retryDelay: retryPlugin.exponentialDelay,
    retryCondition: (err) => {
        if (!err.response) {
            return true;
        }
        // Only these codes are meant to be retried
        return !!(
            err.response &&
            (err.response.status === 429 || err.response.status >= 500)
        );
    }
});


const handleApiRequestError = (err) => {
    // Log the error and throw it again
    try {
        if (err.response && err.response.status === 401) {
            console.error(
                'Got a 401, User was not authorized' +
                `Error message is ${err.toString()}`,
                { err }
            );
        } else if (!err.response) {
            // if there's no response object then the user wasn't able to connect to the api so either they don't
            // have an active internet connection or our api is down
            if (err.toString() === 'Cancel') {
                console.log(
                    'Request exceeded the front-end timeout',
                    { err }
                );
            } else if (err.toString() === 'Error: Network Error') {
                console.log(
                    'Network error, request timed out or response was not received',
                    { err }
                );
            } else {
                console.error(
                    "A network error occurred. User isn't connected to internet or our api is down, " +
                    `second one is most likely since we got this log. Error message is ${err.toString()}`,
                    { err }
                );
            }
        } else {
            // If it's any other error then log it so we can handle that too in future versions
            console.error(
                `An error occurred while processing the network request. Error message is ${err.toString()}`,
                { err }
            );
        }
    } catch (e) {
        // Well...
        console.error(
            'An error occurred while determining the error',
            { e }
        );
    }
    // Throw the error again so it can be handled by action creators and we can updates our
    // reducer state accordingly
    throw err;
};

// Method that takes an endpoint, method and data and performs the api request and returns the response
const fetchFromApi =
    async ({
               endpoint,
               method,
               data = null,
               apiKey = null,
               retryRequired = false
           }) => {
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) {
            headers['X-API-KEY'] = apiKey;
        }
        // Take the request method passed from function call, uses get by default
        const reqMethod = method || httpMethod.GET;

        // Use the cancel token to stop the request after timeout expires
        const source = CancelToken.source();

        // Request will be cancelled if it doesn't gets completed in the time frame
        // used in our timeout config
        setTimeout(() => {
            source.cancel();
        }, REQUEST_TIMEOUT);

        // We pass the cancel token along with the request to allow the functionality to cancel the request if it doesn't
        // complete in the timeout period
        if (retryRequired) {
            return axiosWithRetry({
                method: reqMethod,
                data,
                url: `${apiUrl}/${endpoint}`,
                cancelToken: source.token,
                headers
            })
                .then((res) => res)
                .catch(handleApiRequestError);
        }
        return axiosDefault({
            method: reqMethod,
            data,
            url: `${apiUrl}/${endpoint}`,
            cancelToken: source.token,
            headers
        })
            .then((res) => res)
            .catch(handleApiRequestError);
    };


class Currency {
    getCurrencyList = () =>
        fetchFromApi({
            endpoint: 'currencies.json',
            method: httpMethod.GET,
            retryRequired: true
        });

    getConversionMap = () =>
        fetchFromApi({
            endpoint: 'latest.json?app_id=8154406889e445459c3af244f627fa7f',
            method: httpMethod.GET,
            retryRequired: true
        })
}

export default new Currency();
