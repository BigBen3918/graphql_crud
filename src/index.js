import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import client from "./service";

import "bootstrap/dist/js/bootstrap.min";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "./scss/index.scss";

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
        <ToastContainer position="bottom-right" newestOnTop={false} />
    </React.StrictMode>,
    document.getElementById("root")
);
