const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getUserValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid User id format"),
  //catch error
  validatorMiddleware,
];
//----------------------------------------------------

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 2 })
    .withMessage("too short User name")
    .isLength({ max: 100 })
    .withMessage("too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("password required"),

  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
  check("country")
    .notEmpty()
    .withMessage("country is required :)")
    .isString()
    .withMessage("string only allowed"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];
//----------------------------------------------------

exports.updateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User id format")
    .custom((id, { req }) => {
      // eslint-disable-next-line no-new

      // eslint-disable-next-line eqeqeq
      if (req.user.role === "admin" || req.user._id == id) {
        return true;
      }
      throw new Error("you are not allowed to do this action");
    }),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
  check("country")
    .optional()
    .isString()
    .withMessage("string only allowed"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];
//----------------------------------------------------
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
//----------------------------------------------------

exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your new password confirm"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your new password")
    .custom(async (val, { req }) => {
      // 1)verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect");
      }
      // 2)verify  password confrim
      if (val !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),
  validatorMiddleware,
];
//----------------------------------------------------

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];
//----------------------------------------------------

exports.changeLoggedUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your new password confirm"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your new password")
    .custom(async (val, { req }) => {
      // 1)verify current password
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect");
      }
      // 2)verify  password confrim
      if (val !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),
  validatorMiddleware,
];
