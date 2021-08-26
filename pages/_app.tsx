import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from "../components/layout"
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import RootReducer from "../reducers/rootReducer";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/layout.scss';
import "../styles/default.scss";
import "../styles/dashboard.scss";
import "../styles/room.scss";
import "@fortawesome/fontawesome-free/js/brands";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/fontawesome";

const store = createStore(combineReducers({RootReducer}));

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
            <Layout>
            <Component {...pageProps} />
            </Layout>
         </Provider>
}


export default MyApp
