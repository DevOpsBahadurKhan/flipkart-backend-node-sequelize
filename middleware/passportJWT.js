const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('../models/users');
const ExtractJwt = passportJwt.ExtractJwt;
const Strategy = passportJwt.Strategy;

const params = {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = () => {
    const strategy = new Strategy(params, async (payload, done) => {
        try {
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTime) {
                return done(null, false, { message: 'Token expired' });
            }

            const user = await User.findByPk(payload.id);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { session: false });
        }
    };
};
