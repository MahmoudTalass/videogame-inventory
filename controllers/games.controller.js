const asyncHandler = require("express-async-handler");
const { GameService, PlatformService, GenreService, DeveloperService } = require("../db/query");
const { validateGameInput } = require("../middlwares/validation");
const { getListDifferences } = require("../helpers/helpers");

const getAllGames = asyncHandler(async (req, res) => {
   const games = await GameService.getAllGames();

   res.render("games", { title: "All Games", games });
});

const getGame = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const game = await GameService.getGame(id);

   res.render("game", { title: game.title, game });
});

const createGameGet = asyncHandler(async (req, res) => {
   const [genres, developers, platforms] = await Promise.all([
      GenreService.getAllGenres(),
      DeveloperService.getAllDevelopers(),
      PlatformService.getAllPlatforms(),
   ]);

   res.render("create-game-form", {
      title: "Add New Game",
      genres,
      developers,
      platforms,
   });
});

const createGamePost = [
   validateGameInput,
   asyncHandler(async (req, res) => {
      await GameService.createGame(req.body);

      res.redirect("/games");
   }),
];

const updateGameGet = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const [game, genres, developers, platforms, gameDetails] = await Promise.all([
      GameService.getGame(id),
      GenreService.getAllGenres(),
      DeveloperService.getAllDevelopers(),
      PlatformService.getAllPlatforms(),
      GameService.getDetailsOfGame(id),
   ]);

   res.status(400).render("create-game-form", {
      title: "Update Game Details",
      game,
      checkedGenres: gameDetails.genresOfGame,
      checkedDevelopers: gameDetails.developersOfGame,
      checkedPlatforms: gameDetails.platformsOfGame,
      genres,
      developers,
      platforms,
   });
});

const updateGamePost = [
   validateGameInput,
   asyncHandler(async (req, res) => {
      // existing details
      const { developersOfGame, genresOfGame, platformsOfGame } =
         await GameService.getDetailsOfGame(id);

      // updated details (may include existing details)
      const { genres, platforms, developers } = req.body;

      const { toBeAdded: newGenres, toBeDeleted: genresToBeDeleted } = getListDifferences(
         genres,
         genresOfGame
      );
      const { toBeAdded: newDevelopers, toBeDeleted: developersToBeDeleted } = getListDifferences(
         developers,
         developersOfGame
      );
      const { toBeAdded: newPlatforms, toBeDeleted: platformsToBeDeleted } = getListDifferences(
         platforms,
         platformsOfGame
      );

      await GameService.updateGame({
         ...req.body,
         developersToBeDeleted,
         genresToBeDeleted,
         platformsToBeDeleted,
         newGenres,
         newDevelopers,
         newPlatforms,
      });

      res.redirect("/games");
   }),
];

module.exports = {
   getAllGames,
   getGame,
   createGameGet,
   createGamePost,
   updateGameGet,
   updateGamePost,
};
