const asyncHandler = require("express-async-handler");

const getAllPlatforms = asyncHandler((req, res) => {
   console.log("get all");
});

module.exports = {
   getAllPlatforms,
};
