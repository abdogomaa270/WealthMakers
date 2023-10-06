const express = require("express");
// const rateLimit = require("express-rate-limit");

const {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
  verifyresetPasswordValidator,
} = require("../utils/validators/authValidator");
const {
  protect,
  signup,
  verifyEmail,
  generateVerifyCode,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  logout,
} = require("../services/authServices");

// create a limiter for login requests
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 500, // limit each IP to 5 login requests per windowMs
//   message: "Too many login attempts. Please try again later.",
// });

// create a limiter for forgot password requests
// const forgotPasswordLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // limit each IP to 3 forgot password requests per windowMs
//   message: "Too many forgot password attempts. Please try again later.",
// });

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/verifyEmail").post(protect, verifyEmailValidator, verifyEmail);
  router.route("/sendVerifyCode").get(protect, generateVerifyCode);
router.route("/login").post(
  loginValidator,
  // loginLimiter,
  login
);
router.route("/forgotPassword").post(
  //forgotPasswordLimiter,
  forgotPassword
);
router
  .route("/verifyResetCode")
  .post(verifyresetPasswordValidator, verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

router.get("/logout", protect, logout);

module.exports = router;
