const jwt = require('jwt-simple');
const User = require('../models/users');
const Address = require('../models/address');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const validationHandler = require('../validators/validationHnadler');



exports.login = async (req, res, next) => {
    try {
        validationHandler(req);

        const { email, password, keepLoggedIn } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await user.validPassword(password);
        if (!validPassword) {
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error;
        }

        user.keepLoggedIn = keepLoggedIn | false;
        await user.save();

        const expiration = keepLoggedIn ? (24 * 60 * 60 * 1000) : (60 * 60 * 1000); // 24 hours or 1 hour
        const payload = {
            id: user.user_id,
            exp: Math.floor((Date.now() + expiration) / 1000)
        };

        const token = jwt.encode(payload, process.env.SECRET);

        return res.send({ user, token });
    } catch (err) {
        next(err);
    }
};


exports.signup = async (req, res, next) => {
    try {
        validationHandler(req);
        const existinguser = await User.findOne({ where: { email: req.body.email } });
        if (existinguser) {
            const error = new Error("Email already used");
            error.statusCode = 403;
            throw error;
        }
        let user = new User();

        user.email = req.body.email;
        user.password = await user.encryptPassword(req.body.password);
        user.username = req.body.username;

        const token = jwt.encode({ id: user.user_id }, process.env.SECRET);
        //user.accessToken = token; 
        user = await user.save();
        res.send({ user, token });

    } catch (err) {
        next(err);
    }
};

// get Profile user's account along with Address
exports.me = async (req, res, next) => {
    try {
        validationHandler(req);

        const user_id = req.user.user_id;
        const user = await User.findByPk(user_id, { include: Address });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.send(user);
    } catch (err) {
        next(err);
    }
};

// updateProfile
exports.updateProfile = async (req, res, next) => {
    try {
        validationHandler(req);
        const user_id = req.user.user_id;
        const userData = req.body; // Updated user data
        const user = await User.findByPk(user_id);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Update user data
        user.username = userData.username;
        user.email = userData.email;
        if (userData.password) {
            user.password = await user.encryptPassword(userData.password);
        }

        await user.save();
        res.send({ message: "User profile updated successfully", user });
    } catch (err) {
        next(err);
    }
}

// deleteAccount
exports.deleteAccount = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const user = await User.findByPk(user_id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        // Delete user
        await user.destroy();
        res.send({ message: "User account deleted successfully" });
    } catch (err) {
        next(err);
    }
};



// ================================
// Step 1: Forget Password
exports.forgetPassword = async (req, res, next) => {
    try {
        validationHandler(req);
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error("Email not found");
            error.statusCode = 404;
            throw error;
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Set token and expiration time (1 hour)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email with reset token
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'bk209203@gmail.com',
                pass: 'ggce nwhf pndb drai',
            },
        });

        const mailOptions = {
            to: user.email,
            from: 'bk209203@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://${req.headers.host}/resetPassword.html?token=${token}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return next(err);
            }
            res.send({ message: 'Password reset email sent' });
        });
    } catch (err) {
        next(err);
    }
};

// Step 2: Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        validationHandler(req);
        const { newPassword } = req.body;
        const token = req.params.token;
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }, // Ensure token has not expired
            },
        });

        if (!user) {
            const error = new Error("Password reset token is invalid or has expired");
            error.statusCode = 400;
            throw error;
        }

        // Set the new password
        user.password = await user.encryptPassword(newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.send({ message: 'Password has been reset' });
    } catch (err) {
        next(err);
    }
};