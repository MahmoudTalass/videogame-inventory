const asyncHandler = require("express-async-handler");

const getAllGames = asyncHandler((req, res) => {
   console.log("get all");
});

module.exports = {
   getAllGames,
};
