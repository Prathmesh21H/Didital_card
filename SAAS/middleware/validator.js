// middleware/validator.js
const { body } = require("express-validator");

exports.validateRegistration = [
  body("firstName")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Letters only in first name"),
  body("lastName")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Letters only in last name"),
  body("email")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/)
    .withMessage("Invalid email: Numbers/special chars not allowed after @"),
  body("phone").isNumeric().withMessage("Phone must be numbers only"),
  body("password").isLength({ min: 8 }),
];
