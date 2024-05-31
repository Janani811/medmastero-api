const passport = require('passport');
const passportJWT = require('passport-jwt');

const UserModel = require('../user/user.model');

const { Strategy: JwtStrategy } = passportJWT;

// set cookie to jwt
const cookieExtractor = req => {
    let jwt = null;
    if (req && req.cookies) {
        jwt = req.cookies['authcookie'];
    }
    return jwt;
}
const jwtOptions = {};
// set cookieExtractor which has req.cookie to jwtOptions.jwtFromRequest
jwtOptions.jwtFromRequest = cookieExtractor;
// set secret ket from env to jwtOptions.secretOrKey
jwtOptions.secretOrKey = process.env.JWT_SECRET;

module.exports = () => {
    // default strategy of passport
    const strategy = new JwtStrategy(jwtOptions, async (jwtPayload, next) => {
        // get us_id from jwtPayload (which has user id - from cookie)
        const userId = jwtPayload.us_id;
        try {
            // get user using userId
            const user = await UserModel.getOne({ us_id: userId });
            return next(null, user);
        } catch (err) {
            return next(null, false);
        }
    });

    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),

        // checks token and if valid, add a user to req object , else throws error
        authenticate: (req, res, next) =>
            passport.authenticate('jwt', (err, user) => {
                // set user from passport
                const loggedUser = user;
                // set req.user (currentuser) as user
                req.user = loggedUser;

                // if user not there, send Unauthorized
                if (!user) {
                    return res.status(401).send('Unauthorized');
                }
                // else move to next
                return next(null, user);
            })(req, res, next),
    };
};
