const { gql } = require("apollo-server-express");

const typeDefs = gql`
    scalar Date

    type User {
        id: ID
        name: String
        gender: Int
        birthday: Date
    }

    type Query {
        getUsers: [User]
        findUser(name: String): User
    }

    type Mutation {
        addUser(name: String, gender: Int, birthday: Date): User
        updateUser(id: ID, name: String, gender: Int, birthday: Date): User
        deleteUser(id: ID): User
    }
`;

module.exports = { typeDefs };
