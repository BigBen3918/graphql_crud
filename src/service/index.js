import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://192.168.115.168:5000/graphql",
    // uri: process.env.REACT_APP_BASEURL + "graphql",
    cache: new InMemoryCache(),
});

export default client;
