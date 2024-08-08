const asyncHandler = require("express-async-handler");

const getAllGenres = asyncHandler((req, res) => {
   console.log("get all");
});

module.exports = {
   getAllGenres,
};
