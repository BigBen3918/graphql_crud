module.exports = {
    add: async (req, res) => {
        const { param } = req.body;
        console.log(param);
    },
};
