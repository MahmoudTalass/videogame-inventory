const asyncHandler = require("express-async-handler");
const { GameService } = require("../db/query");

const getAllGames = asyncHandler(async (req, res) => {
   const games = await GameService.getAllGames();

   res.render("games", { title: "Games", games });
});

const getGame = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const game = await GameService.getGame(id);

   // display in view
});

module.exports = {
   getAllGames,
   getGame,
};
