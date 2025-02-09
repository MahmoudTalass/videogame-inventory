const asyncHandler = require("express-async-handler");
const { GameService, PlatformService, GenreService, DeveloperService } = require("../db/query");
const { validateGameInputUpdate, validateGameInputCreate } = require("../middlwares/validation");
const { getListDifferences } = require("../helpers/helpers");

const getAllGames = asyncHandler(async (req, res) => {
   const games = await GameService.getAllGames();

   res.render("games", { title: "All Games", games });
});

const getGame = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const [game, genres, developers, platforms] = await Promise.all([
      GameService.getGame(id),
      GenreService.getGenresOfGame(id),
      DeveloperService.getDevelopersOfGame(id),
      PlatformService.getPlatformsOfGame(id),
   ]);

   if (game.length == 0) {
      return res.redirect("/games");
   }

   res.render("game", {
      title: game.title,
      game,
      genres,
      developers,
      platforms,
   });
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
   validateGameInputCreate,
   asyncHandler(async (req, res) => {
      await GameService.createGame(req.body);

      res.status(201).redirect("/games");
   }),
];

const updateGameGet = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const [game, genres, developers, platforms, gameDetails] = await Promise.all([
      GameService.getGame(id),
      GenreService.getAllGenres(),
      DeveloperService.getAllDevelopers(),
      PlatformService.getAllPlatforms(),
      GameService.getIdsOfGameDetails(id),
   ]);

   res.status(400).render("update-game-form", {
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
   validateGameInputUpdate,
   asyncHandler(async (req, res) => {
      const { id } = req.params;

      // existing details
      const { developersOfGame, genresOfGame, platformsOfGame } =
         await GameService.getIdsOfGameDetails(id);

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
         gameId: id,
      });

      res.status(204).redirect("/games/" + id);
   }),
];

const deleteGame = asyncHandler(async (req, res) => {
   const { id } = req.params;

   await GameService.deleteGame(id);

   res.status(204).redirect("/games");
});

module.exports = {
   getAllGames,
   getGame,
   createGameGet,
   createGamePost,
   updateGameGet,
   updateGamePost,
   deleteGame,
};
