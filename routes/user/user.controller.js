import User from './user.model.js';

// Update personal profile
const updateUser = async (req, res) => {
    try {
        const data = req.body;
        // checking if user already exist
        const isUserExist = await User.getOne({ us_id: req.user.us_id });

        // if user already exist, return false
        if (!isUserExist) {
            return res.status(400).json({
                status: false,
                message: 'User not exist',
                error: error.message
            });
        }
        // update user
        await User.update({ us_id: req.user.us_id }, data)

        // fetch user
        let updatedUser = await User.getOne({ us_id: req.user.us_id });

        return res.status(200).json({ updatedUser, message: "User updated successfully" });
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }

}

export default {
    updateUser
};