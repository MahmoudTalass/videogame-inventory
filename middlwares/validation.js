const { validationResult, body } = require("express-validator");
const asyncHandler = require("express-async-handler");

const validateGameInput = [
   body("title")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Title must be 1-50 characters long."),
   body("description")
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("Description must be 1-500 characters long."),
   body("release")
      .isInt({ min: 1958, max: new Date().getFullYear() })
      .withMessage(`Release year must be between 1958 and ${new Date().getFullYear()}`),
   body("rating")
      .isInt({ min: 0, max: 10 })
      .withMessage("Rating must be an integer between 0 and 10."),
   body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must at least be 0.")
      .customSanitizer((price) => parseFloat(price).toFixed(2)),
   body("genres").isArray({ min: 1 }).withMessage("Must select at least one genre."),
   body("platforms").isArray({ min: 1 }).withMessage("Must select at least one platform."),
   body("developers").isArray({ min: 1 }).withMessage("Must select at least one developer."),
   asyncHandler((req, res, next) => {
      const errors = validationResult(req);

      console.log(req.body);

      if (!errors.isEmpty()) {
         return res.status(400).render("create-game-form", {
            title: "Add New Game",
            genres: req.genres || [],
            developers: req.developers || [],
            platforms: req.platforms || [],
            errors: errors.array(),
         });
      }

      next();
   }),
];

module.exports = {
   validateGameInput,
};
