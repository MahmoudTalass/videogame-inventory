const asyncHandler = require("express-async-handler");

const getAllDevelopers = asyncHandler((req, res) => {
   console.log("get all");
});

module.exports = {
   getAllDevelopers,
};
