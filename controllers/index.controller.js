const asyncHandler = require("express-async-handler");

const getAllCategories = asyncHandler((req, res) => {
   console.log("get all");
});

module.exports = {
   getAllCategories,
};
