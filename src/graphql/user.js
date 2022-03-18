import { gql } from "@apollo/client";

// Query
const getAllUsers = gql`
    query GetUsers {
        getUsers {
            id
            name
            gender
            birthday
        }
    }
`;

const findUser = gql`
    query FindUser($id: ID) {
        findUser(id: $id) {
            id
            name
            gender
            birthday
        }
    }
`;

// Mutation
const ADD_USER = gql`
    mutation AddUser($name: String, $gender: Int, $birthday: Date) {
        addUser(name: $name, gender: $gender, birthday: $birthday) {
            id
            name
            gender
            birthday
        }
    }
`;

const UPDATE_USER = gql`
    mutation UpdateUser(
        $id: ID!
        $name: String
        $gender: Int
        $birthday: Date
    ) {
        updateUser(id: $id, name: $name, gender: $gender, birthday: $birthday) {
            id
            name
            gender
            birthday
        }
    }
`;

const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
        }
    }
`;

export { ADD_USER, UPDATE_USER, DELETE_USER, getAllUsers, findUser };
