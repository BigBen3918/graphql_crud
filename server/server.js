const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const router = express.Router();
const routes = require("./api");
const { typeDefs } = require("./config");
const { resolvers } = require("./graphql");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET"],
    })
);

mongoose
    .connect("mongodb://localhost/graphqlDB", {
        promiseLibrary: require("bluebird"),
        useNewUrlParser: true,
    })
    .then(() => console.log("Successfully Connected MongoDB"))
    .catch((err) => console.error(err));

routes(router);
app.use("/api", router);

// app.use(express.static(__dirname + "/build"));
// app.get("/*", function (req, res) {
//     res.sendFile(__dirname + "/build/index.html", function (err) {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// });

const startApolloServer = async (typeDefs, resolvers) => {
    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    const port = process.env.SERVER_PORT || 5555;
    app.listen(port, () => console.log(`Running on port ${port}`));
};

startApolloServer(typeDefs, resolvers);
