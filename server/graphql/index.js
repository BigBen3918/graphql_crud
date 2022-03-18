const UserModel = require("../model/user");

const resolvers = {
    Query: {
        getUsers: async (parent, args, context, info) => {
            return UserModel.find()
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        findUser: async (parent, args, context, info) => {
            const { id } = args;
            return UserModel.findOne({
                _id: id,
            })
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    Mutation: {
        addUser: async (parent, args, context, info) => {
            const { name, gender, birthday } = args;

            const checkUser = await UserModel.findOne({ name: name });

            if (checkUser) {
                return;
            }

            const newUser = new UserModel({
                name: name,
                gender: gender,
                birthday: birthday,
            });
            return newUser
                .save()
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        updateUser: async (parent, args, context, info) => {
            const { id, name, gender, birthday } = args;

            let flag = false;
            const checkUser = await UserModel.find({ name: name });
            checkUser.map((user) => {
                if (user._id.toString() !== id) {
                    flag = true;
                    return;
                }
            });

            if (flag) return;

            return UserModel.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        name: name,
                        gender: gender,
                        birthday: birthday,
                    },
                }
            )
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        deleteUser: async (parent, args, context, info) => {
            const { id } = args;
            return UserModel.deleteOne({
                _id: id,
            })
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};

module.exports = { resolvers };
