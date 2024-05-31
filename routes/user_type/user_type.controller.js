const UserType = require("./user_type.model");

const getAll = async (req, res) => {
    try {
        const userTypes = await UserType.getAll();
        res.status(200).json(userTypes);
    } catch (error) { 
        console.log("ERROR: ", error)
        res.status(400).json({error: error, message: "Internal server error!" });
    }
 
}

module.exports = { getAll }