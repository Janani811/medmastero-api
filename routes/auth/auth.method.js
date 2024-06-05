const { validationResult } = require("express-validator");

const validate = async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let validationError = [];
        for (let error of errors.array()) {
            validationError.push({
                message: error.msg,
                field: error.path
            })
        }
        return validationError;
    }
    return true;
}

module.exports = {
    validate
}