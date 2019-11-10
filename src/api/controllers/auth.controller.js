/*eslint-disable */
const httpStatus = require("http-status");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const VerifyToken = require("../models/verifyToken.model");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../../config/vars");
const { omit } = require("lodash");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, "role");
    const user = await new User(userData).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());

    // Create a verification token for this user
    var verifyToken = new VerifyToken({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex")
    });
    const verifyTokenResult = await verifyToken.save();

    if (verifyTokenResult) {
      var transporter = nodemailer.createTransport({
        service: "Sendgrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        from: "no-reply@xjet.io",
        to: user.email,
        subject: "Account Verification Token",
        html: `<p>Dear ${user.username},</p>
          <p>
          <div>Your account will be activate after you verify below link:</div>
          <div>Click <a href="${process.env.WEB_URL}/confirmation?token=${verifyToken.token}">here</a> to verify your email address and sign in.</div>
          <div>Contact <a href="cs@xjet.io"></a> with any questions about your registration.</div>
          </p>
          <p>
          <div>Regards,</div>
          <div>Xjet.io team</div></p>`
      };
      transporter.sendMail(mailOptions, function(err) {
        if (err) {
          return console.log({ msg: err.message });
        }
        console.log(
          "A verification email has been sent to " + user.email + "."
        );
      });
    }

    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject
    });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log(token);
    const verifyToken = await VerifyToken.findOne({ token: token });
    if (!verifyToken) {
      return res.status(400).send({
        message:
          "We were unable to find a valid token. Your token my have expired."
      });
    }

    // If we found a token, find a matching user
    const user = await User.findOne({ _id: verifyToken.userId });
    if (!user)
      return res
        .status(400)
        .send({ message: "We were unable to find a user for this token." });
    if (user.emailVerify)
      return res.status(400).send({
        message: "This user has already been verified."
      });

    // Verify and save the user
    user.emailVerify = true;
    const updatedUser = await user.save();
    if (!updatedUser) {
      return res
        .status(500)
        .send({
          message: "Unknown error has been occurred. Please contact to admin"
        });
    }
    res
      .status(200)
      .send({ message: "The account has been verified. Please sign in for the next process." });
  } catch (error) {
    return next(error);
  }
};
