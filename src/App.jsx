import './App.css';
import Router from "./Router";
import { Provider } from "react-redux";
import store, { persistor } from './store';
import { PersistGate } from "redux-persist/integration/react";
import 'antd/dist/antd.css';

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <Router />
            </PersistGate>
        </Provider>
    );
}

export default App;
