const { validationResult, body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { DeveloperService, GenreService, PlatformService } = require("../db/query");

const gameInputValidation = [
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
   body("genres")
      .custom((value) => (Array.isArray(value) ? value.length > 1 : value.length > 0))
      .withMessage("Must select at least one genre.")
      .customSanitizer((value) => {
         const arr = !Array.isArray(value) ? [value] : value;
         const parsedToNums = arr.map((num) => Number(num));
         return parsedToNums;
      }),
   body("platforms")
      .custom((value) => (Array.isArray(value) ? value.length > 1 : value.length > 0))
      .withMessage("Must select at least one platform.")
      .customSanitizer((value) => {
         const arr = !Array.isArray(value) ? [value] : value;
         const parsedToNums = arr.map((num) => Number(num));
         return parsedToNums;
      }),
   body("developers")
      .custom((value) => (Array.isArray(value) ? value.length > 1 : value.length > 0))
      .withMessage("Must select at least one developer.")
      .customSanitizer((value) => {
         const arr = !Array.isArray(value) ? [value] : value;
         const parsedToNums = arr.map((num) => Number(num));
         return parsedToNums;
      }),
];

const validateGameInputCreate = [
   gameInputValidation,
   asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         const game = {
            title: req.body.title,
            description: req.body.description,
            release_year: req.body.release,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
         };

         const [genres, developers, platforms] = await Promise.all([
            GenreService.getAllGenres(),
            DeveloperService.getAllDevelopers(),
            PlatformService.getAllPlatforms(),
         ]);

         return res.status(400).render("create-game-form", {
            title: "Add New Game",
            game,
            checkedGenres: req.genres || [],
            checkedDevelopers: req.developers || [],
            checkedPlatforms: req.platforms || [],
            genres,
            developers,
            platforms,
            errors,
         });
      }

      next();
   }),
];

const validateGameInputUpdate = [
   gameInputValidation,
   asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         const game = {
            title: req.body.title,
            description: req.body.description,
            release_year: req.body.release,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
         };

         const [genres, developers, platforms] = await Promise.all([
            GenreService.getAllGenres(),
            DeveloperService.getAllDevelopers(),
            PlatformService.getAllPlatforms(),
         ]);

         return res.status(400).render("update-game-form", {
            title: "Update Game",
            game,
            checkedGenres: req.genres || [],
            checkedDevelopers: req.developers || [],
            checkedPlatforms: req.platforms || [],
            genres,
            developers,
            platforms,
            errors,
         });
      }

      next();
   }),
];

const validateGenre = [
   body("name")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Genre name must be between 1 and 50 characters long."),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(400).render("create-category-form", {
            title: "Add New Genre",
            name: req.body.name,
            errors: errors.array(),
         });
      }

      next();
   },
];
const validateDeveloper = [
   body("name")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Developer name must be between 1 and 100 characters long."),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(400).render("create-category-form", {
            title: "Add New Developer",
            name: req.body.name,
            errors: errors.array(),
         });
      }

      next();
   },
];
const validatePlatform = [
   body("name")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Platform name must be between 1 and 50 characters long."),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(400).render("create-category-form", {
            title: "Add New Platform",
            name: req.body.name,
            errors: errors.array(),
         });
      }

      next();
   },
];

module.exports = {
   validateGameInputCreate,
   validateGameInputUpdate,
   validateDeveloper,
   validateGenre,
   validatePlatform,
};
